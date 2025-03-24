import React from 'react';
import { Box, useTheme } from '@mui/material';
import { motion } from 'framer-motion';

const BalloonChart = ({ options, totalVotes }) => {
  const theme = useTheme();
  const colors = [
    theme.palette.primary.main,
    theme.palette.secondary.main,
    '#FF9800',
    '#4CAF50',
    '#9C27B0'
  ];

  // Calculate percentages and heights
  const percentages = options.map(opt => 
    totalVotes > 0 ? (opt.votes / totalVotes) * 100 : 0
  );
  
  // Calculate cumulative heights for stacking
  let cumulativeHeight = 0;
  const liquidHeights = percentages.map(percentage => {
    const height = percentage;
    cumulativeHeight += height;
    return {
      height,
      yPosition: 100 - cumulativeHeight
    };
  });

  return (
    <Box
      sx={{
        width: '100%',
        height: 500,
        position: 'relative',
        my: 4
      }}
    >
      <svg
        viewBox="0 0 200 400"
        style={{
          width: '100%',
          height: '100%',
          maxWidth: 300,
          margin: '0 auto',
          display: 'block'
        }}
      >
        {/* Balloon shadow */}
        <ellipse
          cx="100"
          cy="285"
          rx="40"
          ry="5"
          fill="rgba(0,0,0,0.1)"
        />

        {/* Balloon string */}
        <path
          d="M100,260 Q95,270 100,280 Q105,290 100,300"
          fill="none"
          stroke="#999"
          strokeWidth="1"
          strokeDasharray="2"
        />

        {/* Main balloon body - outer glow */}
        <path
          d="M60,120 
             C60,50 140,50 140,120
             C140,180 120,230 100,260
             C80,230 60,180 60,120
             Z"
          fill="rgba(255,255,255,0.2)"
          filter="url(#glow)"
        />

        {/* Balloon neck and tie */}
        <path
          d="M90,260 
             C95,250 105,250 110,260
             L105,265
             Q100,268 95,265
             Z"
          fill="#ccc"
          stroke="#bbb"
          strokeWidth="1"
        />

        {/* Filters for lighting effects */}
        <defs>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          
          <linearGradient id="shineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.3)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </linearGradient>
        </defs>

        {/* Balloon shine effect */}
        <path
          d="M70,80 
             Q100,50 130,80"
          fill="none"
          stroke="url(#shineGradient)"
          strokeWidth="20"
          opacity="0.5"
        />

        {/* Liquids container */}
        <clipPath id="balloon">
          <path
            d="M60,120 
               C60,50 140,50 140,120
               C140,180 120,230 100,260
               C80,230 60,180 60,120
               Z"
          />
        </clipPath>

        {/* Liquids */}
        <g clipPath="url(#balloon)">
          {liquidHeights.map((liquid, index) => (
            <motion.path
              key={index}
              d={`M0,${300 - liquid.height * 2.5} 
                  H200 
                  V300 
                  H0 Z`}
              initial={{ y: 300 }}
              animate={{ 
                y: 0,
                transition: { 
                  duration: 1.5,
                  delay: index * 0.3,
                  ease: "easeOut"
                }
              }}
              fill={colors[index]}
              opacity="0.8"
            >
              <animate
                attributeName="d"
                dur="4s"
                repeatCount="indefinite"
                values={`M0,${300 - liquid.height * 2.5} 
                        H200 V300 H0 Z;
                        M0,${300 - liquid.height * 2.5} 
                        Q50,${295 - liquid.height * 2.5} 100,${300 - liquid.height * 2.5}
                        Q150,${305 - liquid.height * 2.5} 200,${300 - liquid.height * 2.5}
                        V300 H0 Z;
                        M0,${300 - liquid.height * 2.5} 
                        H200 V300 H0 Z`}
              />
            </motion.path>
          ))}
        </g>

        {/* Legend */}
        <g transform="translate(10, 320)">
          {options.map((option, index) => (
            <g
              key={index}
              transform={`translate(0, ${index * 25})`}
            >
              <rect
                x="0"
                y="0"
                width="14"
                height="14"
                rx="2"
                fill={colors[index]}
                opacity="0.8"
              />
              <text
                x="24"
                y="11"
                fontSize="12"
                fill="#666"
                style={{ fontFamily: 'Arial' }}
              >
                {option.text} ({Math.round(percentages[index])}%)
              </text>
            </g>
          ))}
        </g>
      </svg>
    </Box>
  );
};

export default BalloonChart; 