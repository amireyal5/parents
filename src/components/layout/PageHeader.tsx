import React, { FC, ReactNode } from 'react';

interface PageHeaderProps {
    title: string;
    tags: { label: string; value: string }[];
    breadcrumbs: { label: string; path?: string }[];
    actions?: ReactNode;
    tabs?: { label: string; id: string }[];
    activeTab?: string;
    onTabChange?: (tabId: string) => void;
    navigate: (path: string) => void;
}

export const PageHeader: FC<PageHeaderProps> = ({ title, tags, breadcrumbs, actions, tabs, activeTab, onTabChange, navigate }) => {
    return (
        <header className="page-header">
            <div className="page-header-top">
                <h1>{title}</h1>
                <div className="tags">
                    {tags.map(tag => <span key={tag.label} className="tag">{tag.label}: <strong>{tag.value}</strong></span>)}
                </div>
            </div>
            <div className="page-header-bottom">
                 <div className={tabs ? "page-header-tabs" : "breadcrumbs"}>
                    {tabs ? (
                        tabs.map(tab => (
                             <button 
                                key={tab.id}
                                className={`tab-button ${activeTab === tab.id ? 'active' : ''}`} 
                                onClick={() => onTabChange?.(tab.id)}
                            >
                                {tab.label}
                            </button>
                        ))
                    ) : (
                         breadcrumbs.map((crumb, index) => (
                            <span key={index}>
                                {crumb.path ? <a href={`#${crumb.path}`} onClick={(e)=>{e.preventDefault(); navigate(crumb.path)}}>{crumb.label}</a> : crumb.label}
                                {index < breadcrumbs.length - 1 && <span>/</span>}
                            </span>
                        ))
                    )}
                </div>
                <div className="actions">
                    {actions}
                </div>
            </div>
        </header>
    );
};
