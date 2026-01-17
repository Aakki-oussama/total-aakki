import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

interface ViewHeaderProps {
    onBack?: () => void;
}

export default function ViewHeader({ onBack }: ViewHeaderProps) {
    const navigate = useNavigate();
    const handleBack = onBack || (() => navigate('/societes'));

    return (
        <button
            onClick={handleBack}
            className="flex items-center gap-2 px-4 py-2 bg-surface border border-border/60 text-muted hover:text-primary transition-all font-bold rounded-xl shadow-sm hover:shadow-md group text-sm"
        >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            <span>Retour</span>
        </button>
    );
}
