/**
 * Shared course icon utility — replaces @iconify/react runtime HTTP requests
 * with react-icons build-time bundled SVGs.
 */
import React from 'react';
import { SiJavascript, SiPython, SiGo, SiCplusplus, SiTypescript, SiDocker, SiKubernetes, SiGit, SiGnubash, SiRust } from 'react-icons/si';
import { FaJava, FaCode } from 'react-icons/fa';
import { LuFlaskConical, LuGem, LuCode, LuMic } from 'react-icons/lu';

// Map of iconify icon names → react-icons components
const ICON_MAP: Record<string, React.ComponentType<{ className?: string; size?: number }>> = {
    // Simple Icons / Logos
    'simple-icons:javascript': SiJavascript,
    'simple-icons:python': SiPython,
    'simple-icons:go': SiGo,
    'simple-icons:cplusplus': SiCplusplus,
    'simple-icons:typescript': SiTypescript,
    'fontisto:java': FaJava,
    'logos:javascript': SiJavascript,
    'logos:python': SiPython,
    'logos:go': SiGo,
    'logos:c-plusplus': SiCplusplus,
    'logos:docker-icon': SiDocker,
    'logos:kubernetes': SiKubernetes,
    'logos:git-icon': SiGit,
    'logos:bash-icon': SiGnubash,
    'logos:rust': SiRust,
    'logos:java': FaJava,
    'logos:code': LuCode,
    // Lucide icons
    'lucide:flask-conical': LuFlaskConical,
    'lucide:gem': LuGem,
    'lucide:code': LuCode,
    'lucide:mic': LuMic,
};

/**
 * StaticIcon — drop-in replacement for @iconify/react's <Icon> component.
 * Resolves icons from ICON_MAP at build time (zero runtime HTTP requests).
 */
export const StaticIcon: React.FC<{ icon: string; className?: string }> = ({ icon, className }) => {
    const IconComponent = ICON_MAP[icon];
    if (!IconComponent) {
        // Fallback for unknown icons
        return <FaCode className={className} />;
    }
    return <IconComponent className={className} />;
};

/**
 * Course-specific icon config (used by LessonContentPanel, DashboardClient, CourseHistoryGrid)
 */
export interface CourseIconConfig {
    icon: string;
    color: string;
    shadow: string;
    textColor: string;
    borderColor: string;
    label: string;
}

export const getCourseIconConfig = (courseId: string = '', courseTitle: string = '', courseIcon: string = '', language: string = ''): CourseIconConfig => {
    const id = courseId.toLowerCase();
    const title = courseTitle.toLowerCase();
    const icon = courseIcon?.toLowerCase() || '';
    const lang = language.toLowerCase();

    if (icon === 'c++' || title.includes('c++') || id.includes('cpp') || lang === 'cpp' || lang === 'c++') {
        return { icon: 'logos:c-plusplus', color: 'bg-blue-900/20', shadow: 'shadow-blue-500/10', textColor: 'text-blue-400', borderColor: 'border-blue-500/20', label: 'C++' };
    }
    if (icon === 'python' || title.includes('python') || id.includes('python') || lang === 'python') {
        return { icon: 'logos:python', color: 'bg-yellow-900/20', shadow: 'shadow-yellow-500/10', textColor: 'text-yellow-400', borderColor: 'border-yellow-500/20', label: 'Python' };
    }
    if (icon === 'go' || title.includes('go') || id.includes('go') || lang === 'go') {
        return { icon: 'logos:go', color: 'bg-cyan-900/20', shadow: 'shadow-cyan-500/10', textColor: 'text-cyan-400', borderColor: 'border-cyan-500/20', label: 'Go' };
    }
    if (icon === 'rust' || title.includes('rust') || id.includes('rust') || lang === 'rust') {
        return { icon: 'logos:rust', color: 'bg-orange-900/20', shadow: 'shadow-orange-500/10', textColor: 'text-orange-400', borderColor: 'border-orange-500/20', label: 'Rust' };
    }
    if (icon === 'java' || title.includes('java') || id.includes('java') || lang === 'java') {
        return { icon: 'logos:java', color: 'bg-red-900/20', shadow: 'shadow-red-500/10', textColor: 'text-red-400', borderColor: 'border-red-500/20', label: 'Java' };
    }

    // Default to JavaScript
    return { icon: 'logos:javascript', color: 'bg-yellow-500/10', shadow: 'shadow-yellow-500/10', textColor: 'text-yellow-400', borderColor: 'border-yellow-500/20', label: 'JavaScript' };
};
