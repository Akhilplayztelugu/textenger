import React from 'react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { File, Download, Image, Video, FileText, Archive, Music, MoreHorizontal } from 'lucide-react';

// Mock data for files
const mockFiles = [
  {
    id: 1,
    name: 'Gaming_Setup_2024.jpg',
    type: 'image',
    size: '2.4 MB',
    uploadedAt: '2 hours ago',
    downloadUrl: '#'
  },
  {
    id: 2,
    name: 'React_Component_Guide.pdf',
    type: 'document',
    size: '1.2 MB',
    uploadedAt: '1 day ago',
    downloadUrl: '#'
  },
  {
    id: 3,
    name: 'Epic_Gaming_Montage.mp4',
    type: 'video',
    size: '45.6 MB',
    uploadedAt: '3 days ago',
    downloadUrl: '#'
  },
  {
    id: 4,
    name: 'Pixel_Art_Assets.zip',
    type: 'archive',
    size: '8.9 MB',
    uploadedAt: '1 week ago',
    downloadUrl: '#'
  },
  {
    id: 5,
    name: 'Background_Music.mp3',
    type: 'audio',
    size: '5.1 MB',
    uploadedAt: '1 week ago',
    downloadUrl: '#'
  },
  {
    id: 6,
    name: 'Project_Proposal.docx',
    type: 'document',
    size: '890 KB',
    uploadedAt: '2 weeks ago',
    downloadUrl: '#'
  }
];

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center h-96 text-center">
    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
      <File className="w-8 h-8 text-muted-foreground" />
    </div>
    <h3 className="mb-2">No files yet</h3>
    <p className="text-muted-foreground mb-4">Upload your first file to get started</p>
  </div>
);

const getFileIcon = (type: string) => {
  switch (type) {
    case 'image':
      return Image;
    case 'video':
      return Video;
    case 'audio':
      return Music;
    case 'archive':
      return Archive;
    case 'document':
      return FileText;
    default:
      return File;
  }
};

const getFileColor = (type: string) => {
  switch (type) {
    case 'image':
      return 'text-green-500';
    case 'video':
      return 'text-red-500';
    case 'audio':
      return 'text-purple-500';
    case 'archive':
      return 'text-yellow-500';
    case 'document':
      return 'text-blue-500';
    default:
      return 'text-gray-500';
  }
};

const FileCard = ({ file }: { file: typeof mockFiles[0] }) => {
  const Icon = getFileIcon(file.type);
  const colorClass = getFileColor(file.type);

  const handleDownload = () => {
    console.log(`Downloading ${file.name}...`);
  };

  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-lg bg-muted flex items-center justify-center ${colorClass}`}>
            <Icon className="w-5 h-5" />
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-medium truncate">{file.name}</h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>{file.size}</span>
              <span>•</span>
              <span>{file.uploadedAt}</span>
            </div>
          </div>
          
          <div className="flex gap-1">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={handleDownload}
              className="hover:bg-accent"
            >
              <Download className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Filter files by type
const filterFilesByType = (files: typeof mockFiles, type: string) => {
  if (type === 'all') return files;
  return files.filter(file => file.type === type);
};

export function FilesPage() {
  const [activeFilter, setActiveFilter] = React.useState('all');

  const filters = [
    { id: 'all', label: 'All Files', count: mockFiles.length },
    { id: 'image', label: 'Images', count: mockFiles.filter(f => f.type === 'image').length },
    { id: 'video', label: 'Videos', count: mockFiles.filter(f => f.type === 'video').length },
    { id: 'document', label: 'Documents', count: mockFiles.filter(f => f.type === 'document').length },
    { id: 'audio', label: 'Audio', count: mockFiles.filter(f => f.type === 'audio').length },
    { id: 'archive', label: 'Archives', count: mockFiles.filter(f => f.type === 'archive').length }
  ];

  const filteredFiles = filterFilesByType(mockFiles, activeFilter);

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-4">
        <h1 className="mb-6">Files</h1>
        
        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {filters.map((filter) => (
            <Button
              key={filter.id}
              variant={activeFilter === filter.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveFilter(filter.id)}
              className="whitespace-nowrap"
            >
              {filter.label} ({filter.count})
            </Button>
          ))}
        </div>
        
        {/* Files List */}
        {filteredFiles.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="space-y-3">
            {filteredFiles.map((file) => (
              <FileCard key={file.id} file={file} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}