import type { Meta, StoryObj } from '@storybook/react';
import { FileUpload } from '@/components/ui/file-upload';
import { Label } from '@/components/ui/label';
import { useState } from 'react';

const meta: Meta<typeof FileUpload> = {
  title: 'UI/FileUpload',
  component: FileUpload,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    accept: {
      control: 'text',
      description: 'Accepted file types (MIME types)',
    },
    multiple: {
      control: 'boolean',
      description: 'Allow multiple file uploads',
    },
    maxSize: {
      control: 'number',
      description: 'Maximum file size in MB',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the file upload is disabled',
    },
  },
  decorators: [
    (Story) => (
      <div className="w-[500px]">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const [files, setFiles] = useState<Array<{ name: string; preview?: string; size: number }>>([]);

    const handleFilesSelected = (fileList: FileList) => {
      const newFiles = Array.from(fileList).map(file => ({
        name: file.name,
        size: file.size,
        preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
      }));
      setFiles([...files, ...newFiles]);
    };

    const handleRemoveFile = (index: number) => {
      setFiles(files.filter((_, i) => i !== index));
    };

    return (
      <FileUpload
        onFilesSelected={handleFilesSelected}
        files={files}
        onRemoveFile={handleRemoveFile}
      />
    );
  },
};

export const WithLabel: Story = {
  render: () => {
    const [files, setFiles] = useState<Array<{ name: string; preview?: string; size: number }>>([]);

    const handleFilesSelected = (fileList: FileList) => {
      const newFiles = Array.from(fileList).map(file => ({
        name: file.name,
        size: file.size,
        preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
      }));
      setFiles([...files, ...newFiles]);
    };

    const handleRemoveFile = (index: number) => {
      setFiles(files.filter((_, i) => i !== index));
    };

    return (
      <div className="grid w-full gap-1.5">
        <Label>Upload Documents</Label>
        <FileUpload
          onFilesSelected={handleFilesSelected}
          files={files}
          onRemoveFile={handleRemoveFile}
        />
      </div>
    );
  },
};

export const MultipleFiles: Story = {
  render: () => {
    const [files, setFiles] = useState<Array<{ name: string; preview?: string; size: number }>>([]);

    const handleFilesSelected = (fileList: FileList) => {
      const newFiles = Array.from(fileList).map(file => ({
        name: file.name,
        size: file.size,
        preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
      }));
      setFiles([...files, ...newFiles]);
    };

    const handleRemoveFile = (index: number) => {
      setFiles(files.filter((_, i) => i !== index));
    };

    return (
      <FileUpload
        onFilesSelected={handleFilesSelected}
        files={files}
        onRemoveFile={handleRemoveFile}
        multiple
      />
    );
  },
};

export const ImagesOnly: Story = {
  render: () => {
    const [files, setFiles] = useState<Array<{ name: string; preview?: string; size: number }>>([]);

    const handleFilesSelected = (fileList: FileList) => {
      const newFiles = Array.from(fileList).map(file => ({
        name: file.name,
        size: file.size,
        preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
      }));
      setFiles([...files, ...newFiles]);
    };

    const handleRemoveFile = (index: number) => {
      setFiles(files.filter((_, i) => i !== index));
    };

    return (
      <div className="grid w-full gap-1.5">
        <Label>Upload Images</Label>
        <FileUpload
          onFilesSelected={handleFilesSelected}
          files={files}
          onRemoveFile={handleRemoveFile}
          accept="image/jpeg,image/png,image/jpg"
          multiple
        />
      </div>
    );
  },
};

export const PDFOnly: Story = {
  render: () => {
    const [files, setFiles] = useState<Array<{ name: string; preview?: string; size: number }>>([]);

    const handleFilesSelected = (fileList: FileList) => {
      const newFiles = Array.from(fileList).map(file => ({
        name: file.name,
        size: file.size,
      }));
      setFiles([...files, ...newFiles]);
    };

    const handleRemoveFile = (index: number) => {
      setFiles(files.filter((_, i) => i !== index));
    };

    return (
      <div className="grid w-full gap-1.5">
        <Label>Upload PDF Documents</Label>
        <FileUpload
          onFilesSelected={handleFilesSelected}
          files={files}
          onRemoveFile={handleRemoveFile}
          accept="application/pdf"
          multiple
        />
      </div>
    );
  },
};

export const WithMaxSize: Story = {
  render: () => {
    const [files, setFiles] = useState<Array<{ name: string; preview?: string; size: number }>>([]);

    const handleFilesSelected = (fileList: FileList) => {
      const maxSizeBytes = 2 * 1024 * 1024; // 2MB
      const validFiles = Array.from(fileList).filter(file => file.size <= maxSizeBytes);

      if (validFiles.length !== fileList.length) {
        alert('Some files exceed the 2MB limit and were not added');
      }

      const newFiles = validFiles.map(file => ({
        name: file.name,
        size: file.size,
        preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
      }));
      setFiles([...files, ...newFiles]);
    };

    const handleRemoveFile = (index: number) => {
      setFiles(files.filter((_, i) => i !== index));
    };

    return (
      <div className="grid w-full gap-1.5">
        <Label>Upload Files (Max 2MB)</Label>
        <FileUpload
          onFilesSelected={handleFilesSelected}
          files={files}
          onRemoveFile={handleRemoveFile}
          maxSize={2}
          multiple
        />
      </div>
    );
  },
};

export const Disabled: Story = {
  render: () => {
    const [files] = useState<Array<{ name: string; preview?: string; size: number }>>([]);

    return (
      <FileUpload
        onFilesSelected={() => {}}
        files={files}
        disabled
      />
    );
  },
};

export const WithPreloadedFiles: Story = {
  render: () => {
    const [files, setFiles] = useState<Array<{ name: string; preview?: string; size: number }>>([
      { name: 'document.pdf', size: 1024000 },
      { name: 'report.pdf', size: 2048000 },
    ]);

    const handleFilesSelected = (fileList: FileList) => {
      const newFiles = Array.from(fileList).map(file => ({
        name: file.name,
        size: file.size,
        preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
      }));
      setFiles([...files, ...newFiles]);
    };

    const handleRemoveFile = (index: number) => {
      setFiles(files.filter((_, i) => i !== index));
    };

    return (
      <FileUpload
        onFilesSelected={handleFilesSelected}
        files={files}
        onRemoveFile={handleRemoveFile}
        multiple
      />
    );
  },
};

export const FormExample: Story = {
  render: () => {
    const [identityDocs, setIdentityDocs] = useState<Array<{ name: string; preview?: string; size: number }>>([]);
    const [addressProof, setAddressProof] = useState<Array<{ name: string; preview?: string; size: number }>>([]);

    const handleIdentityDocsSelected = (fileList: FileList) => {
      const newFiles = Array.from(fileList).map(file => ({
        name: file.name,
        size: file.size,
        preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
      }));
      setIdentityDocs([...identityDocs, ...newFiles]);
    };

    const handleAddressProofSelected = (fileList: FileList) => {
      const newFiles = Array.from(fileList).map(file => ({
        name: file.name,
        size: file.size,
        preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
      }));
      setAddressProof([...addressProof, ...newFiles]);
    };

    return (
      <form className="space-y-6">
        <div className="grid w-full gap-1.5">
          <Label>Identity Document</Label>
          <p className="text-sm text-muted-foreground">
            Upload a photo of your ID, passport, or driver's license
          </p>
          <FileUpload
            onFilesSelected={handleIdentityDocsSelected}
            files={identityDocs}
            onRemoveFile={(index) => setIdentityDocs(identityDocs.filter((_, i) => i !== index))}
            accept="image/jpeg,image/png,image/jpg"
            multiple
          />
        </div>
        <div className="grid w-full gap-1.5">
          <Label>Proof of Address</Label>
          <p className="text-sm text-muted-foreground">
            Upload a recent utility bill or bank statement
          </p>
          <FileUpload
            onFilesSelected={handleAddressProofSelected}
            files={addressProof}
            onRemoveFile={(index) => setAddressProof(addressProof.filter((_, i) => i !== index))}
            accept="image/jpeg,image/png,image/jpg,application/pdf"
            multiple
          />
        </div>
      </form>
    );
  },
};
