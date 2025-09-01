"use client"
import React, { ReactNode } from 'react';
import MuiCard from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { CardProps as MuiCardProps } from '@mui/material/Card';
import { CardContentProps } from '@mui/material/CardContent';

export interface CardProps extends MuiCardProps {
  children: ReactNode;
  contentProps?: CardContentProps;
}

const Card: React.FC<CardProps> = ({
  children,
  contentProps,
  ...cardProps
}) => {
  return (
    <MuiCard {...cardProps} className='w-[350px]'>
      <CardContent {...contentProps}>{children}</CardContent>
    </MuiCard>
  );
};

export default Card;