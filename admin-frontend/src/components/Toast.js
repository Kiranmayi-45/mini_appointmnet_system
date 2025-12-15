import { useEffect } from 'react';
import { AlertCircle, CheckCircle, X } from 'lucide-react';

const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div 
      className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg flex items-center gap-3 ${
        type === 'success' ? 'bg-green-500' : 'bg-red-500'
      } text-white z-50 min-w-[300px] max-w-md animate-slide-in`}
    >
      {type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
      <span className="flex-1">{message}</span>
      <button 
        onClick={onClose} 
        className="hover:bg-white/20 rounded p-1 transition"
      >
        <X size={16} />
      </button>
    </div>
  );
};

export default Toast;