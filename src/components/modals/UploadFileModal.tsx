import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Upload, File, X, FileText, Image, Video, Music } from 'lucide-react';

interface UploadFileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function UploadFileModal({ isOpen, onClose }: UploadFileModalProps) {
  const [fileName, setFileName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setFileName(file.name);
    }
  };

  const handleUpload = async () => {
    setIsLoading(true);
    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log('Uploading file...', { 
      name: fileName, 
      description, 
      file: selectedFile?.name,
      size: selectedFile?.size,
      type: selectedFile?.type
    });
    setIsLoading(false);
    onClose();
    setFileName('');
    setDescription('');
    setSelectedFile(null);
  };

  const handleClose = () => {
    onClose();
    setFileName('');
    setDescription('');
    setSelectedFile(null);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) return Image;
    if (fileType.startsWith('video/')) return Video;
    if (fileType.startsWith('audio/')) return Music;
    return FileText;
  };

  const getFileTypeColor = (fileType: string) => {
    if (fileType.startsWith('image/')) return 'text-green-600';
    if (fileType.startsWith('video/')) return 'text-blue-600';
    if (fileType.startsWith('audio/')) return 'text-purple-600';
    return 'text-gray-600';
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg bg-card/95 backdrop-blur-md border border-border/50 shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-foreground text-xl flex items-center gap-2">
            <File className="w-5 h-5 text-primary" />
            Upload File
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 mt-6">
          {/* File Upload Area */}
          <div className="space-y-4">
            {selectedFile ? (
              <div className="p-4 bg-card/60 rounded-lg border border-border/40">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    {React.createElement(getFileIcon(selectedFile.type), {
                      className: `w-6 h-6 ${getFileTypeColor(selectedFile.type)}`
                    })}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{selectedFile.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatFileSize(selectedFile.size)} • {selectedFile.type || 'Unknown type'}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedFile(null);
                      setFileName('');
                    }}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="border-2 border-dashed border-border/60 rounded-lg p-8 text-center bg-card/40 backdrop-blur-sm">
                <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-2">Upload any file</p>
                <p className="text-xs text-muted-foreground mb-4">Documents, images, videos, audio, and more</p>
                <input
                  type="file"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                />
                <Button asChild variant="outline" className="bg-card/60 border-border/40">
                  <label htmlFor="file-upload" className="cursor-pointer">
                    Choose File
                  </label>
                </Button>
              </div>
            )}
          </div>

          {/* File Details */}
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">File Name</label>
              <Input
                placeholder="Enter a custom name (optional)..."
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                className="bg-input-background/80 border-border/40 text-foreground placeholder:text-muted-foreground"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Description</label>
              <Textarea
                placeholder="Add a description for your file..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="min-h-[80px] bg-input-background/80 border-border/40 text-foreground placeholder:text-muted-foreground resize-none"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button 
              variant="outline" 
              onClick={handleClose}
              className="flex-1 bg-card/60 border-border/40 text-foreground hover:bg-accent/60"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleUpload}
              disabled={!selectedFile || isLoading}
              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {isLoading ? 'Uploading...' : 'Upload File'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}