import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Target, CheckCircle, Activity, Zap, Award } from 'lucide-react';

const MetricCard = ({ title, value, icon: Icon, color, delay = 0, description }) => {
  const colorClasses = {
    purple: {
      bg: 'from-slate-700 to-slate-800',
      border: 'border-slate-600',
      glow: 'hover:shadow-slate-500/30',
      text: 'text-slate-300',
    },
    blue: {
      bg: 'from-slate-700 to-slate-800',
      border: 'border-slate-600',
      glow: 'hover:shadow-slate-500/30',
      text: 'text-slate-300',
    },
    green: {
      bg: 'from-slate-700 to-slate-800',
      border: 'border-slate-600',
      glow: 'hover:shadow-slate-500/30',
      text: 'text-slate-300',
    },
    orange: {
      bg: 'from-slate-700 to-slate-800',
      border: 'border-slate-600',
      glow: 'hover:shadow-slate-500/30',
      text: 'text-slate-300',
    },
    pink: {
      bg: 'from-slate-700 to-slate-800',
      border: 'border-slate-600',
      glow: 'hover:shadow-slate-500/30',
      text: 'text-slate-300',
    },
    cyan: {
      bg: 'from-slate-700 to-slate-800',
      border: 'border-slate-600',
      glow: 'hover:shadow-slate-500/30',
      text: 'text-slate-300',
    },
  };

  const colorClass = colorClasses[color] || colorClasses.purple;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.5,
        delay,
        type: "spring",
        stiffness: 100,
      }}
      whileHover={{
        scale: 1.05,
        y: -5,
        transition: { duration: 0.2 },
      }}
      className={`relative overflow-hidden rounded-xl border-2 ${colorClass.border} bg-gradient-to-br ${colorClass.bg} p-6 shadow-lg transition-all duration-300 ${colorClass.glow} hover:shadow-2xl cursor-pointer group`}
    >
      {/* Animated background gradient */}
      <motion.div
        className="absolute inset-0 opacity-0 group-hover:opacity-20 bg-gradient-to-tr from-white to-transparent"
        initial={{ x: '-100%', y: '-100%' }}
        whileHover={{
          x: '100%',
          y: '100%',
          transition: { duration: 0.8, ease: "easeInOut" },
        }}
      />

      {/* Icon with animation */}
      <motion.div
        className="flex items-center justify-between mb-4"
        whileHover={{ scale: 1.1 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <motion.div
          animate={{
            rotate: [0, 10, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        >
          {Icon && <Icon className="h-8 w-8 text-white" />}
        </motion.div>
        
        {/* Pulse indicator */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
          className="h-3 w-3 rounded-full bg-white"
        />
      </motion.div>

      {/* Title */}
      <h3 className="text-sm font-medium text-white/90 uppercase tracking-wider mb-2">
        {title}
      </h3>

      {/* Value with animated counter effect */}
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: delay + 0.2, type: "spring" }}
        className="text-3xl font-bold text-white mb-2"
      >
        {typeof value === 'number' ? value.toFixed(4) : value}
      </motion.div>

      {/* Description on hover */}
      {description && (
        <motion.p
          initial={{ opacity: 0, height: 0 }}
          whileHover={{ opacity: 1, height: 'auto' }}
          className="text-xs text-white/70 mt-2 overflow-hidden"
        >
          {description}
        </motion.p>
      )}

      {/* Animated border on hover */}
      <motion.div
        className="absolute bottom-0 left-0 h-1 bg-white"
        initial={{ width: '0%' }}
        whileHover={{ width: '100%' }}
        transition={{ duration: 0.3 }}
      />

      {/* Corner decoration */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </motion.div>
  );
};

const AnimatedMetrics = ({ metrics }) => {
  const metricConfigs = [
    {
      key: 'accuracy',
      title: 'Accuracy',
      icon: Target,
      color: 'purple',
      description: 'Overall correctness of the model',
    },
    {
      key: 'precision',
      title: 'Precision',
      icon: CheckCircle,
      color: 'blue',
      description: 'Accuracy of positive predictions',
    },
    {
      key: 'recall',
      title: 'Recall',
      icon: Activity,
      color: 'green',
      description: 'Ability to find all positive cases',
    },
    {
      key: 'f1',
      title: 'F1 Score',
      icon: Zap,
      color: 'orange',
      description: 'Harmonic mean of precision and recall',
    },
    {
      key: 'roc_auc',
      title: 'ROC AUC',
      icon: TrendingUp,
      color: 'pink',
      description: 'Area under the ROC curve',
    },
    {
      key: 'mcc',
      title: 'MCC',
      icon: Award,
      color: 'cyan',
      description: 'Matthews Correlation Coefficient',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {metricConfigs.map((config, index) => {
        const value = metrics[config.key];
        if (value === undefined) return null;

        return (
          <MetricCard
            key={config.key}
            title={config.title}
            value={value}
            icon={config.icon}
            color={config.color}
            delay={index * 0.1}
            description={config.description}
          />
        );
      })}
    </div>
  );
};

export default AnimatedMetrics;
