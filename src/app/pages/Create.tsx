import { Upload, Video, Image, Sparkles } from 'lucide-react';
import { Button } from '../components/ui/button';

export default function Create() {
  return (
    <div className="min-h-screen bg-white pb-24">
      {/* Header */}
      <div className="px-4 pt-12 pb-6 border-b border-zinc-200">
        <h1 className="text-2xl font-bold">Create</h1>
        <p className="text-sm text-zinc-600 mt-1">Share your products with the community</p>
      </div>

      {/* Upload Options */}
      <div className="px-4 py-8 space-y-4">
        <button className="w-full bg-gradient-to-r from-pink-500 via-red-500 to-purple-500 text-white p-6 rounded-2xl hover:opacity-90 transition-opacity">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-4 rounded-xl">
              <Video className="w-8 h-8" />
            </div>
            <div className="text-left flex-1">
              <h2 className="text-lg font-bold">Create Video</h2>
              <p className="text-sm opacity-90">Record or upload a product video</p>
            </div>
          </div>
        </button>

        <button className="w-full bg-black text-white p-6 rounded-2xl hover:bg-zinc-800 transition-colors">
          <div className="flex items-center gap-4">
            <div className="bg-white/10 p-4 rounded-xl">
              <Image className="w-8 h-8" />
            </div>
            <div className="text-left flex-1">
              <h2 className="text-lg font-bold">Upload Photo</h2>
              <p className="text-sm opacity-75">Share product images</p>
            </div>
          </div>
        </button>

        <button className="w-full bg-gradient-to-r from-cyan-400 to-blue-500 text-white p-6 rounded-2xl hover:opacity-90 transition-opacity">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-4 rounded-xl">
              <Sparkles className="w-8 h-8" />
            </div>
            <div className="text-left flex-1">
              <h2 className="text-lg font-bold">AI Generate</h2>
              <p className="text-sm opacity-90">Create content with AI</p>
            </div>
          </div>
        </button>
      </div>

      {/* Tips */}
      <div className="px-4 mt-8">
        <h3 className="font-bold text-lg mb-4">Tips for Great Content</h3>
        <div className="space-y-3">
          {[
            'Keep videos under 60 seconds',
            'Show product details clearly',
            'Use good lighting',
            'Add engaging descriptions',
            'Include relevant hashtags',
          ].map((tip, i) => (
            <div key={i} className="flex items-start gap-3 bg-zinc-50 p-3 rounded-xl">
              <div className="bg-black text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-sm font-bold">
                {i + 1}
              </div>
              <p className="text-sm text-zinc-700">{tip}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
