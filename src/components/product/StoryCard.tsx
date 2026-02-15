'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ChevronDown, ChevronUp, Edit3, Mic } from 'lucide-react';

interface StoryCardProps {
  story: string;
  transcript?: string;
  onStoryEdit?: (newStory: string) => void;
  editable?: boolean;
}

export default function StoryCard({ 
  story, 
  transcript, 
  onStoryEdit, 
  editable = true 
}: StoryCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editStory, setEditStory] = useState(story);
  const [activeTab, setActiveTab] = useState<'story' | 'transcript'>('story');

  const shortStory = story.length > 150 ? story.substring(0, 150) + '...' : story;
  const needsTruncation = story.length > 150;

  const handleStorySubmit = () => {
    onStoryEdit?.(editStory);
    setIsEditing(false);
  };

  return (
    <motion.div
      className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-4 border-b border-amber-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-amber-600 rounded-full flex items-center justify-center">
              <Star className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-lg font-serif font-semibold text-gray-800">The Artisan's Story</h3>
          </div>
          
          <div className="flex items-center gap-2">
            {editable && (
              <button
                onClick={() => setIsEditing(true)}
                className="p-2 text-gray-500 hover:text-amber-600 transition-colors"
              >
                <Edit3 className="w-4 h-4" />
              </button>
            )}
            {needsTruncation && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex items-center gap-1 text-sm text-amber-700 hover:text-amber-800 transition-colors"
              >
                <span>{isExpanded ? 'Show Less' : 'Read More'}</span>
                {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {isEditing ? (
          <div className="space-y-4">
            {/* Edit Tabs */}
            <div className="flex border-b border-gray-200">
              <button
                onClick={() => setActiveTab('story')}
                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'story'
                    ? 'border-amber-600 text-amber-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Generated Story
              </button>
              {transcript && (
                <button
                  onClick={() => setActiveTab('transcript')}
                  className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'transcript'
                      ? 'border-amber-600 text-amber-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Mic className="w-3 h-3" />
                    Original Transcript
                  </div>
                </button>
              )}
            </div>

            {/* Edit Content */}
            <div className="space-y-4">
              <textarea
                value={activeTab === 'story' ? editStory : transcript || ''}
                onChange={(e) => {
                  if (activeTab === 'story') {
                    setEditStory(e.target.value);
                  }
                }}
                className="w-full h-40 p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                placeholder="Tell your story..."
                readOnly={activeTab === 'transcript'}
              />
              
              <div className="flex gap-3">
                <button
                  onClick={handleStorySubmit}
                  className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-medium"
                  disabled={activeTab === 'transcript'}
                >
                  Save Changes
                </button>
                <button
                  onClick={() => {
                    setEditStory(story);
                    setIsEditing(false);
                  }}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence mode="wait">
              <motion.p
                key={isExpanded ? 'full' : 'short'}
                className="text-gray-700 leading-relaxed font-serif italic text-lg"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                "{isExpanded ? story : shortStory}"
              </motion.p>
            </AnimatePresence>

            {/* Transcript Section */}
            {transcript && (
              <motion.div
                className="bg-gray-50 rounded-lg p-4 border-l-4 border-amber-400"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Mic className="w-4 h-4 text-amber-600" />
                  <span className="text-sm font-medium text-gray-700">Original Voice Recording</span>
                </div>
                <p className="text-sm text-gray-600 italic">"{transcript}"</p>
              </motion.div>
            )}

            {/* Story Stats */}
            <div className="flex items-center gap-4 pt-2 text-sm text-gray-500">
              <span>{story.split(' ').length} words</span>
              <span>•</span>
              <span>{Math.ceil(story.length / 200)} min read</span>
              {transcript && (
                <>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Mic className="w-3 h-3" />
                    Voice captured
                  </span>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
