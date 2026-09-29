import React, { useState } from 'react';
import { X, Star, ThumbsUp, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { dbService } from '../services/db';
import { User } from '../types';

interface RatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  targetUserId: string;
  targetUserName: string;
  targetRole: 'DRIVER' | 'PASSENGER' | 'PROVIDER';
  contextTitle: string;
  onSuccess: () => void;
}

export const RatingModal: React.FC<RatingModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  targetUserId,
  targetUserName,
  targetRole,
  contextTitle,
  onSuccess,
}) => {
  const [rating, setRating] = useState(5);
  const [punctualityScore, setPunctualityScore] = useState(5);
  const [vehicleOrSkillScore, setVehicleOrSkillScore] = useState(5);
  const [comment, setComment] = useState('');
  const [isDone, setIsDone] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dbService.submitReview({
      fromUserId: currentUser.id,
      fromUserName: currentUser.name,
      toUserId: targetUserId,
      toUserName: targetUserName,
      roleTarget: targetRole,
      rating,
      punctualityScore,
      vehicleOrSkillScore,
      comment: comment || 'Smooth experience, highly recommended.',
      contextTitle
    });
    setIsDone(true);
    onSuccess();
    setTimeout(() => {
      setIsDone(false);
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-sm">Two-Way Peer Rating & Trust Score</h3>
            <p className="text-xs text-slate-400 mt-0.5">{contextTitle}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {isDone ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-slate-900 text-base">Rating Submitted!</h4>
            <p className="text-xs text-slate-500">
              Thank you for keeping Naijashare safe and transparent.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            
            <div className="text-center space-y-1">
              <p className="text-xs text-slate-500">Rate your experience with</p>
              <h4 className="text-base font-bold text-slate-900">{targetUserName}</h4>
              <span className="text-[11px] font-mono bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                Role: {targetRole}
              </span>
            </div>

            {/* Star selector */}
            <div className="flex justify-center items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="p-1 cursor-pointer transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-7 h-7 ${
                      star <= rating
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-slate-300'
                    }`}
                  />
                </button>
              ))}
            </div>

            {/* Sub-ratings */}
            <div className="space-y-3 pt-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Punctuality at pickup:</span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setPunctualityScore(s)}
                      className={`w-6 h-6 rounded text-[11px] font-semibold transition-colors ${
                        s === punctualityScore
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-600">
                  {targetRole === 'DRIVER' ? 'Driving & AC Cleanliness:' : 'Courtesy & Cooperation:'}
                </span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setVehicleOrSkillScore(s)}
                      className={`w-6 h-6 rounded text-[11px] font-semibold transition-colors ${
                        s === vehicleOrSkillScore
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Written Review</label>
              <textarea
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share helpful details for other community members..."
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl transition-colors cursor-pointer shadow-xs"
            >
              Publish Peer Rating
            </button>
          </form>
        )}

      </div>
    </div>
  );
};
