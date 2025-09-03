import React, { useState } from 'react';
import type { Note } from '../models/Note';

const NotePage = ({ onClose, note, onSave }: { onClose: () => void; note: Note | Partial<Note>; onSave: (note: Note | Partial<Note>) => void }) => {
  const [title, setTitle] = useState(note?.title || '');
  const [content, setContent] = useState(note?.content || '');
  const [tags, setTags] = useState(note?.tags || []);
  const [tagInput, setTagInput] = useState('');

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim() !== '') {
        const newTags = tagInput.split(',').map(tag => tag.trim());
        const uniqueNewTags = newTags.filter(newTag => 
            newTag !== '' && !tags.some(existingTag => 
                existingTag.toLowerCase() === newTag.toLowerCase()
            )
        );
        setTags([...tags, ...uniqueNewTags]);
        setTagInput('');
    }
};

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSave = async () => {
    await onSave({ ...note, title, content, tags });
    onClose();
  };

  const formatDate = (date?: string) => {
    if (!date) return 'N/A';
    const d = new Date(date);
    return d.toLocaleDateString() + ' ' + d.toLocaleTimeString();
  };

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-900/25 backdrop-blur-sm flex justify-center items-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl transform transition-all p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
          </button>
          <div className="flex flex-col h-full">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-4xl font-bold text-gray-800 dark:text-gray-200 mb-4 bg-transparent border-none focus:outline-none"
              placeholder="Title"
            />
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="flex-grow w-full text-lg text-gray-700 dark:text-gray-300 bg-transparent border-none resize-none focus:outline-none mb-4"
              placeholder="Start writing..."
              rows={10}
            />
            <div className="flex flex-col mt-4">
              <h4 className="text-md font-medium text-gray-500 dark:text-gray-400 mb-2">Tags:</h4>
              <div className="flex flex-wrap gap-2 mb-2">
                {tags.map(tag => (
                  <span key={tag} className="bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 text-xs font-medium px-2.5 py-0.5 rounded-full flex items-center">
                    {tag}
                    <button onClick={() => handleRemoveTag(tag)} className="ml-1 text-blue-800 dark:text-blue-200 hover:text-blue-900 dark:hover:text-white">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"></path></svg>
                    </button>
                  </span>
                ))}
              </div>
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleAddTag}
                className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                placeholder="Add tags (separated by commas)"
              />
            </div>
            <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400 mt-6">
              <div className="flex space-x-4">
                {note?.createdAt && (
                  <span className="last-update">
                    Created: {formatDate(note.createdAt)}
                  </span>
                )}
                {note?.updatedAt && (
                  <span className="last-update">
                    Last Update: {formatDate(note.updatedAt)}
                  </span>
                )}
              </div>
              <button
                onClick={handleSave}
                className="px-4 py-2 rounded-lg font-medium bg-blue-500 text-white shadow-lg transition-colors duration-200 hover:bg-blue-700"
              >
                Save Note
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NotePage;