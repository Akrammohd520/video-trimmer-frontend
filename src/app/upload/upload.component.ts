import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-upload',
  standalone: true, // ✅ Add this to make it a standalone component
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css'],
})
export class UploadComponent {
  selectedFile: File | null = null;
  uploadProgress: number = 0;
  isProcessing: boolean = false;
  trimmedVideos: string[] = [];

  constructor(private http: HttpClient) {}

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  uploadVideo() {
    if (!this.selectedFile) {
      alert('Please select a video file first!');
      return;
    }
    this.isProcessing = true;
    this.uploadProgress = 10;

    const formData = new FormData();
    formData.append('file', this.selectedFile);

    this.http
      .post<{ message: string; videoUrls: string[] }>(
        'http://localhost:8088/upload',
        formData,
        {
          reportProgress: true,
          observe: 'events',
        }
      )
      .subscribe(
        (event) => {
          if (event.type === 1 && event.total) {
            this.uploadProgress = Math.round((event.loaded / event.total) * 100);
          } else if (event.type === 4) {
            this.isProcessing = false;
            alert('Upload successful!');
            this.trimmedVideos = event.body?.videoUrls || [];
          }
        },
        (error) => {
          this.isProcessing = false;
          alert('Failed to upload video!');
        }
      );
  }
}
