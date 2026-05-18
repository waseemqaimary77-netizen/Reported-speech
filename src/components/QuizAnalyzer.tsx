import React, { useState, useRef, useEffect } from 'react';
import { Stage, Layer, Rect, Image as KonvaImage, Transformer } from 'react-konva';
import { Upload, Trash2, Brain, Loader2, Info, Camera, X, MousePointer2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { AnalysisRegion } from '../types';

export default function QuizAnalyzer() {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [base64Image, setBase64Image] = useState<string | null>(null);
  const [regions, setRegions] = useState<AnalysisRegion[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [explanation, setExplanation] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [newRegion, setNewRegion] = useState<AnalysisRegion | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [tool, setTool] = useState<'draw' | 'select'>('draw');
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stageSize, setStageSize] = useState({ width: 500, height: 600 });
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<any>(null);
  const trRef = useRef<any>(null);

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth;
        const height = Math.min(window.innerHeight * 0.7, width * 1.33);
        setStageSize({ width, height });
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, [image, isCameraActive]);

  useEffect(() => {
    if (selectedId && trRef.current) {
      const selectedNode = stageRef.current.findOne('#' + selectedId);
      if (selectedNode) {
        trRef.current.nodes([selectedNode]);
        trRef.current.getLayer().batchDraw();
      }
    }
  }, [selectedId]);

  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new window.Image();
      img.src = reader.result as string;
      img.onload = () => {
        setImage(img);
        setBase64Image(reader.result as string);
        setRegions([]);
        setSelectedId(null);
        setExplanation(null);
      };
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const startCamera = async () => {
    setIsCameraActive(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } } 
      });
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (err) {
      alert("تعذر الوصول إلى الكاميرا. يرجى التأكد من إعطاء الصلاحيات.");
      setIsCameraActive(false);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(videoRef.current, 0, 0);
      const dataUrl = canvas.toDataURL('image/png');
      const img = new window.Image();
      img.src = dataUrl;
      img.onload = () => {
        setImage(img);
        setBase64Image(dataUrl);
        stopCamera();
        setRegions([]);
        setSelectedId(null);
        setExplanation(null);
      };
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
    setIsCameraActive(false);
  };

  const handleMouseDown = (e: any) => {
    if (!image || isAnalyzing) return;
    
    // Deselect if clicking on empty space
    if (e.target === e.target.getStage() || e.target.name() === 'background') {
      setSelectedId(null);
      if (tool === 'draw') {
        const pos = e.target.getStage().getPointerPosition();
        setNewRegion({ id: 'region-' + Date.now().toString(), x: pos.x, y: pos.y, width: 0, height: 0 });
      }
      return;
    }

    // Select clicked region
    const id = e.target.id();
    if (id && id.startsWith('region-')) {
      setSelectedId(id);
      setTool('select');
    }
  };

  const handleMouseMove = (e: any) => {
    if (!newRegion) return;
    const pos = e.target.getStage().getPointerPosition();
    setNewRegion({
      ...newRegion,
      width: pos.x - newRegion.x,
      height: pos.y - newRegion.y,
    });
  };

  const handleMouseUp = () => {
    if (newRegion && (Math.abs(newRegion.width) > 10 || Math.abs(newRegion.height) > 10)) {
      setRegions([...regions, newRegion]);
      setSelectedId(newRegion.id);
      setTool('select');
    }
    setNewRegion(null);
  };

  const handleTransformEnd = (e: any) => {
    const node = e.target;
    const newRegions = regions.map(r => {
      if (r.id === node.id()) {
        return {
          ...r,
          x: node.x(),
          y: node.y(),
          width: node.width() * node.scaleX(),
          height: node.height() * node.scaleY(),
        };
      }
      return r;
    });
    setRegions(newRegions);
    node.scaleX(1);
    node.scaleY(1);
  };

  const deleteSelected = () => {
    if (selectedId) {
      setRegions(regions.filter(r => r.id !== selectedId));
      setSelectedId(null);
    }
  };

  const analyzeQuiz = async () => {
    if (!base64Image || regions.length === 0) return;
    setIsAnalyzing(true);
    setExplanation(null);
    try {
      const response = await fetch('/api/analyze-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: base64Image, regions }),
      });
      const data = await response.json();
      setExplanation(data.explanation);
    } catch (error) {
      setExplanation("عذراً، حدث خطأ أثناء تحليل الصورة.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-8 py-6">
      <div className="text-right">
        <h2 className="text-3xl font-black text-neutral-900 mb-2">محلل الاختبارات الذكي</h2>
        <p className="text-neutral-500">ارفع صورة اختبارك، ارسم مربعات، واحصل على شرح فوري باللغة العربية.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4" ref={containerRef}>
          {!image && !isCameraActive ? (
            <div className="flex flex-col gap-4">
              <label className="flex flex-col items-center justify-center w-full min-h-[300px] border-4 border-dashed border-neutral-200 rounded-[3rem] bg-white cursor-pointer hover:bg-neutral-50 transition-colors py-12 shadow-inner">
                <Upload className="w-12 h-12 text-neutral-300 mb-4" />
                <span className="text-neutral-500 font-bold font-sans">ارفع صورة من جهازك</span>
                <input type="file" className="hidden" onChange={handleUpload} accept="image/*" />
              </label>
              <button 
                onClick={startCamera}
                className="w-full py-8 bg-blue-50 border-2 border-blue-100 rounded-[2.5rem] flex flex-col items-center justify-center text-blue-600 hover:bg-blue-100 transition-all font-bold gap-2 shadow-sm"
              >
                <Camera size={32} />
                <span>التقط صورة بالكاميرا</span>
              </button>
            </div>
          ) : isCameraActive ? (
            <div className="relative rounded-[3rem] overflow-hidden bg-black aspect-[3/4] flex items-center justify-center shadow-2xl border-8 border-white">
              <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
              <div className="absolute bottom-10 left-0 right-0 flex justify-center gap-6 items-center">
                <button onClick={stopCamera} className="p-4 bg-white/20 backdrop-blur-xl text-white rounded-full hover:bg-white/40 transition-colors border border-white/30"><X size={24} /></button>
                <button onClick={capturePhoto} className="p-1 pr-1.5 pl-1.5 bg-white rounded-full shadow-2xl ring-4 ring-white/30 active:scale-90 transition-transform">
                  <div className="w-16 h-16 rounded-full border-4 border-blue-600 flex items-center justify-center text-blue-600">
                    <Camera size={32} />
                  </div>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex gap-2 justify-end mb-2">
                 <button 
                  onClick={deleteSelected}
                  disabled={!selectedId}
                  className="px-4 py-2 bg-red-100 text-red-600 rounded-xl font-bold flex items-center gap-2 disabled:opacity-30"
                >
                  <Trash2 size={18} /> حذف المحدد
                </button>
                <button 
                  onClick={() => setTool('draw')}
                  className={`px-4 py-2 rounded-xl font-bold flex items-center gap-2 ${tool === 'draw' ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-neutral-100 text-neutral-600'}`}
                >
                  رسم <Brain size={18} />
                </button>
                <button 
                  onClick={() => setTool('select')}
                  className={`px-4 py-2 rounded-xl font-bold flex items-center gap-2 ${tool === 'select' ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-neutral-100 text-neutral-600'}`}
                >
                  تعديل <MousePointer2 size={18} />
                </button>
              </div>

              <div className="relative bg-white border-2 border-neutral-100 rounded-[2rem] shadow-2xl overflow-hidden">
                <Stage
                  width={stageSize.width}
                  height={stageSize.height}
                  ref={stageRef}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onTouchStart={handleMouseDown}
                  onTouchMove={handleMouseMove}
                  onTouchEnd={handleMouseUp}
                >
                  <Layer>
                    <KonvaImage name="background" image={image} width={stageSize.width} height={stageSize.height} />
                    {regions.map((region) => (
                      <Rect
                        key={region.id}
                        id={region.id}
                        {...region}
                        draggable={tool === 'select'}
                        stroke={selectedId === region.id ? "#3b82f6" : "#2563eb"}
                        strokeWidth={selectedId === region.id ? 5 : 3}
                        dash={selectedId === region.id ? [] : [10, 5]}
                        fill={selectedId === region.id ? "rgba(59, 130, 246, 0.2)" : "rgba(37, 99, 235, 0.1)"}
                        cornerRadius={4}
                        onTransformEnd={handleTransformEnd}
                        onDragEnd={handleTransformEnd}
                      />
                    ))}
                    {newRegion && (
                      <Rect {...newRegion} stroke="#2563eb" strokeWidth={2} dash={[5, 2]} />
                    )}
                    {tool === 'select' && <Transformer ref={trRef} boundBoxFunc={(oldBox, newBox) => (newBox.width < 10 || newBox.height < 10 ? oldBox : newBox)} />}
                  </Layer>
                </Stage>
              </div>

              <div className="flex items-center justify-between p-4 bg-white rounded-3xl border border-neutral-200 shadow-lg">
                <button onClick={() => { setImage(null); setRegions([]); setSelectedId(null); setExplanation(null); }} className="p-3 bg-red-50 text-red-500 rounded-2xl hover:bg-red-100 transition-colors"><Trash2 size={24} /></button>
                <div className="flex flex-col items-end">
                   <span className="text-xs font-bold text-neutral-400">عدد المناطق: {regions.length}</span>
                   <span className="text-xs text-neutral-400 mt-0.5">يمكنك تحريك وتكبير المربعات لتعديل الاختيار</span>
                </div>
                <button 
                  onClick={analyzeQuiz}
                  disabled={isAnalyzing || regions.length === 0}
                  className="px-8 py-3 bg-blue-600 text-white rounded-2xl font-bold flex items-center gap-3 disabled:bg-neutral-200 disabled:shadow-none hover:bg-blue-700 transition-all shadow-xl shadow-blue-100"
                >
                  {isAnalyzing ? <Loader2 className="animate-spin" size={24} /> : <Brain size={24} />}
                  <span>تحليل الأسئلة</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Results */}
        <div className="space-y-6">
          <div className="bg-white border border-neutral-100 rounded-[2.5rem] p-8 shadow-sm h-full min-h-[400px]">
            {isAnalyzing ? (
              <div className="flex flex-col items-center justify-center h-full space-y-4 py-20">
                <div className="relative">
                  <div className="absolute -inset-4 bg-blue-100 rounded-full animate-ping opacity-20" />
                  <Brain size={64} className="text-blue-600 animate-pulse" />
                </div>
                <p className="text-xl font-bold text-neutral-600 animate-bounce text-right">وسيم، الذكاء الاصطناعي يحلل اختبارك...</p>
              </div>
            ) : explanation ? (
              <div className="prose prose-blue max-w-none text-right">
                <div className="markdown-body text-right" dir="rtl">
                   <ReactMarkdown>{explanation}</ReactMarkdown>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-neutral-300 space-y-4">
                <Brain size={64} />
                <p className="font-bold text-xl">سيظهر الشرح المفصل هنا</p>
                <p className="text-sm">حدد منطقة الرسم ثم اضغط تحليل</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
