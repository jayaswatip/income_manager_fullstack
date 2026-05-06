import React from "react";
import "./LoadingSkeleton.css";

export const CardSkeleton = () => (
    <div className="skeleton-card">
        <div className="skeleton-header">
            <div className="skeleton-title"></div>
            <div className="skeleton-action"></div>
        </div>
        <div className="skeleton-content">
            <div className="skeleton-line"></div>
            <div className="skeleton-line short"></div>
        </div>
    </div>
);

export const StatsSkeleton = () => (
    <div className="skeleton-stats-grid">
        {[1, 2, 3, 4].map((i) => (
            <div key={i} className="skeleton-stat-card">
                <div className="skeleton-icon"></div>
                <div className="skeleton-text">
                    <div className="skeleton-value"></div>
                    <div className="skeleton-label"></div>
                </div>
            </div>
        ))}
    </div>
);

export const TableSkeleton = ({ rows = 5 }) => (
    <div className="skeleton-table">
        <div className="skeleton-table-header">
            <div className="skeleton-th"></div>
            <div className="skeleton-th"></div>
            <div className="skeleton-th"></div>
            <div className="skeleton-th"></div>
        </div>
        {[...Array(rows)].map((_, i) => (
            <div key={i} className="skeleton-table-row">
                <div className="skeleton-td"></div>
                <div className="skeleton-td"></div>
                <div className="skeleton-td"></div>
                <div className="skeleton-td actions"></div>
            </div>
        ))}
    </div>
);

export const ChartSkeleton = () => (
    <div className="skeleton-chart">
        <div className="skeleton-chart-title"></div>
        <div className="skeleton-chart-body">
            <div className="skeleton-chart-circle"></div>
        </div>
    </div>
);

export const FormSkeleton = () => (
    <div className="skeleton-form">
        <div className="skeleton-form-title"></div>
        {[1, 2, 3, 4].map((i) => (
            <div key={i} className="skeleton-form-group">
                <div className="skeleton-label"></div>
                <div className="skeleton-input"></div>
            </div>
        ))}
        <div className="skeleton-button"></div>
    </div>
);

export const GoalCardSkeleton = () => (
    <div className="skeleton-goal-card">
        <div className="skeleton-goal-header">
            <div className="skeleton-goal-icon"></div>
            <div className="skeleton-goal-title"></div>
        </div>
        <div className="skeleton-progress">
            <div className="skeleton-progress-bar"></div>
        </div>
        <div className="skeleton-goal-stats">
            <div className="skeleton-stat"></div>
            <div className="skeleton-stat"></div>
        </div>
    </div>
);
