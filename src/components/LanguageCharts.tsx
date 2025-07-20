import React, { useState } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, LabelList } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface LanguageData {
  name: string;
  value: number;
  percentage: number;
  color: string;
}

interface LanguageChartsProps {
  languageData: LanguageData[];
  isLoading?: boolean;
}

// Language-specific colors based on GitHub's language colors and popular IDE themes
const LANGUAGE_COLORS: Record<string, string> = {
  // Popular Languages
  'JavaScript': '#F7DF1E', // Yellow
  'TypeScript': '#3178C6', // Blue
  'Python': '#3776AB', // Blue
  'Java': '#ED8B00', // Orange
  'C++': '#00599C', // Blue
  'C#': '#239120', // Green
  'PHP': '#777BB4', // Purple
  'Ruby': '#CC342D', // Red
  'Go': '#00ADD8', // Cyan
  'Rust': '#DEA584', // Brown
  'Swift': '#FF6B4A', // Orange
  'Kotlin': '#7F52FF', // Purple
  'Scala': '#DC322F', // Red
  'Dart': '#00B4AB', // Teal
  
  // Web Technologies
  'HTML': '#E34F26', // Orange
  'CSS': '#1572B6', // Blue
  'SCSS': '#CF649A', // Pink
  'Sass': '#CF649A', // Pink
  'Less': '#1D365D', // Dark Blue
  'Vue': '#4FC08D', // Green
  'React': '#61DAFB', // Cyan
  'Angular': '#DD0031', // Red
  
  // Backend & Database
  'SQL': '#336791', // Blue
  'PL/SQL': '#336791', // Blue
  'MySQL': '#4479A1', // Blue
  'PostgreSQL': '#336791', // Blue
  'MongoDB': '#4DB33D', // Green
  'Redis': '#DC382D', // Red
  
  // Mobile & Desktop
  'Objective-C': '#438EFF', // Blue
  'C': '#555555', // Gray
  'F#': '#378BBA', // Blue
  
  // Scripting & Shell
  'Shell': '#4EAA25', // Green
  'Bash': '#4EAA25', // Green
  'PowerShell': '#012456', // Dark Blue
  'Perl': '#39457E', // Dark Blue
  'Lua': '#000080', // Navy
  
  // Data Science & ML
  'R': '#276DC3', // Blue
  'Julia': '#9558B2', // Purple
  'MATLAB': '#E16737', // Orange
  'Jupyter': '#F37626', // Orange
  
  // System & Low-level
  'Assembly': '#6E4C13', // Brown
  'VHDL': '#ADB2CB', // Light Gray
  'Verilog': '#B2B7F8', // Light Blue
  
  // Configuration & Markup
  'YAML': '#CB171E', // Red
  'JSON': '#000000', // Black
  'XML': '#FF6600', // Orange
  'Markdown': '#083FA1', // Blue
  'TOML': '#9C4128', // Brown
  
  // Other Popular
  'Dockerfile': '#2496ED', // Blue
  'Makefile': '#427819', // Green
  'CMake': '#064F8C', // Dark Blue
  'Gradle': '#02303A', // Dark Green
  'Maven': '#C71A36', // Red
  'npm': '#CB3837', // Red
  'yarn': '#2C8EBB', // Blue
  
  // Default fallback colors for unknown languages
  'default': '#6B7280', // Gray
};

// Fallback colors for languages not in the mapping
const FALLBACK_COLORS = [
  '#3B82F6', // Blue
  '#10B981', // Green
  '#F59E0B', // Yellow
  '#EF4444', // Red
  '#8B5CF6', // Purple
  '#06B6D4', // Cyan
  '#F97316', // Orange
  '#EC4899', // Pink
  '#84CC16', // Lime
  '#6366F1', // Indigo
  '#14B8A6', // Teal
  '#F43F5E', // Rose
];

const getLanguageColor = (languageName: string, index: number): string => {
  // Try to get the specific language color
  const specificColor = LANGUAGE_COLORS[languageName];
  if (specificColor) {
    return specificColor;
  }
  
  // If not found, use fallback colors
  return FALLBACK_COLORS[index % FALLBACK_COLORS.length];
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-background/95 backdrop-blur-sm border border-border rounded-xl p-4 shadow-2xl">
        <div className="flex items-center gap-3 mb-2">
          <div 
            className="w-4 h-4 rounded-full shadow-sm"
            style={{ backgroundColor: getLanguageColor(data.name, 0) }}
          />
          <p className="font-semibold text-foreground text-sm">{data.name}</p>
        </div>
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">{data.value.toLocaleString()}</span> bytes
          </p>
          <p className="text-xs text-muted-foreground">
            <span className="font-medium text-primary">{data.percentage}%</span> of total codebase
          </p>
        </div>
      </div>
    );
  }
  return null;
};

const CustomPieTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-background/95 backdrop-blur-sm border border-border rounded-xl p-4 shadow-2xl">
        <div className="flex items-center gap-3 mb-2">
          <div 
            className="w-4 h-4 rounded-full shadow-sm"
            style={{ backgroundColor: getLanguageColor(data.name, 0) }}
          />
          <p className="font-semibold text-foreground text-sm">{data.name}</p>
        </div>
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">{data.value.toLocaleString()}</span> bytes
          </p>
          <p className="text-xs text-muted-foreground">
            <span className="font-medium text-primary">{data.percentage}%</span> of total codebase
          </p>
        </div>
      </div>
    );
  }
  return null;
};

const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }: any) => {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text 
      x={x} 
      y={y} 
      fill="white" 
      textAnchor={x > cx ? 'start' : 'end'} 
      dominantBaseline="central"
      className="text-xs font-medium"
    >
      {percent > 0.05 ? `${(percent * 100).toFixed(0)}%` : ''}
    </text>
  );
};

const renderCustomizedLabelLine = ({ cx, cy, midAngle, innerRadius, outerRadius }: any) => {
  const RADIAN = Math.PI / 180;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const mx = cx + (outerRadius + 20) * cos;
  const my = cy + (outerRadius + 20) * sin;

  return (
    <path
      d={`M ${cx + outerRadius * cos} ${cy + outerRadius * sin} L ${mx} ${my}`}
      stroke="#666"
      fill="none"
      strokeWidth={1}
    />
  );
};

export default function LanguageCharts({ languageData, isLoading = false }: LanguageChartsProps) {
  const [showAllLanguages, setShowAllLanguages] = useState(false);
  
  // Get top 5 languages and the rest
  const top5Languages = languageData?.slice(0, 5) || [];
  const remainingLanguages = languageData?.slice(5) || [];
  
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-card shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold">Code by Language (bytes)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-48">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold">Language Usage (%)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-48">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!languageData || languageData.length === 0) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-card shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold">Code by Language (bytes)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-48 text-muted-foreground">
              <p>No language data available</p>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold">Language Usage (%)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-48 text-muted-foreground">
              <p>No language data available</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Bar Chart - Left Side */}
      <Card className="glass-card shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold">Code by Language (bytes)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart
              data={languageData}
              margin={{ top: 30, right: 20, left: 10, bottom: 10 }}
            >
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 10, fill: '#9CA3AF' }}
                angle={-45}
                textAnchor="end"
                height={60}
                interval={0}
              />
              <YAxis 
                tick={{ fontSize: 10, fill: '#9CA3AF' }}
                tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                width={40}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="value" 
                radius={[3, 3, 0, 0]}
                animationDuration={1500}
                animationBegin={0}
              >
                {/* {top5Languages.map((entry, index) => ( */}
                {languageData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={getLanguageColor(entry.name, index)}
                  />
                ))}
                <LabelList 
                  dataKey="value" 
                  position="top" 
                  formatter={(value: number) => `${(value / 1000).toFixed(0)}k`}
                  style={{ fontSize: '9px', fill: '#9CA3AF' }}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Pie Chart - Right Side */}
      <Card className="glass-card shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold">Language Usage (%)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={top5Languages}
                cx="50%"
                cy="50%"
                labelLine={renderCustomizedLabelLine}
                label={renderCustomizedLabel}
                outerRadius={70}
                fill="#8884d8"
                dataKey="value"
                animationDuration={1500}
                animationBegin={0}
              >
                {top5Languages.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={getLanguageColor(entry.name, index)}
                    stroke="none"
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomPieTooltip />} />
              <Legend 
                verticalAlign="bottom" 
                height={60}
                wrapperStyle={{
                  paddingTop: '15px',
                  fontSize: '12px',
                  fontWeight: '500'
                }}
                                content={({ payload }) => (
                  <div className="flex flex-col items-center space-y-4">
                    {/* Top Languages Section - Below the chart, centered */}
                    <div className="w-full text-center">
                      {/* <h4 className="text-sm font-semibold text-foreground mb-3">Top Languages</h4> */}
                      <div className="flex gap-1 px-4 py-2 justify-center flex-wrap">
                        {payload?.slice(0, 3).map((entry: any, index: number) => (
                          <div 
                            key={entry.value} 
                            className="flex items-center gap-2 px-3 py-1 rounded-xl bg-black/10 backdrop-blur-sm border border-border/30 hover:bg-black/20 transition-all duration-200 cursor-pointer group text-sm"
                          >
                            <div 
                              className="w-2.5 h-2.5 rounded-full shadow-sm flex-shrink-0"
                              style={{ backgroundColor: entry.color }}
                            />
                            <span className="font-medium text-foreground group-hover:text-primary transition-colors duration-200 whitespace-nowrap">
                              {entry.value}
                            </span>
                            <span className="text-muted-foreground flex-shrink-0">
                              {top5Languages.find(item => item.name === entry.value)?.percentage}%
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
        
        {/* View All Section - Below the chart, centered */}
        {remainingLanguages.length > 0 && (
          <div className="px-6 pb-4">
            <div className="flex justify-center">
              <Popover>
                <PopoverTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="text-sm h-8 px-4 bg-background/30 backdrop-blur-sm border-border/50 hover:bg-background/50 transition-all duration-200"
                  >
                    View All Languages 
                    <ChevronDown className="w-4 h-4 ml-2" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-96 p-4 bg-background/95 backdrop-blur-sm border border-border">
                  <div className="space-y-3">
                    <h4 className="font-semibold text-sm text-foreground mb-3">All Languages</h4>
                    <div className="grid grid-cols-1 gap-2 max-h-60 overflow-y-auto">
                      {languageData.map((language, index) => (
                        <div 
                          key={language.name}
                          className="flex items-center justify-between p-2 rounded-md bg-background/30 hover:bg-background/50 transition-all duration-200"
                        >
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-3 h-3 rounded-full shadow-sm"
                              style={{ backgroundColor: getLanguageColor(language.name, index) }}
                            />
                            <span className="text-sm font-medium text-foreground">
                              {language.name}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">
                              {language.value.toLocaleString()} bytes
                            </span>
                            <span className="text-xs font-medium text-primary">
                              {language.percentage}%
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
} 