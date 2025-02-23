import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-upload',
  standalone: true,
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css'],
  imports: [CommonModule, FormsModule, MatProgressBarModule], // ✅ Import missing modules
})
export class UploadComponent {
  selectedFile: File | null = null;
  uploadProgress: number = 0;
  isProcessing: boolean = false;
  trimmedVideos: string[] = [];
  trimDuration: number = 30; // Default trim duration

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
  
    this.http.post<{ message: string; fileName: string }>(
      'http://localhost:8088/api/upload', // Ensure backend URL matches
      formData,
      { headers: { 'Accept': 'application/json' }, reportProgress: true, observe: 'events' }
    ).subscribe(event => {
      if (event.type === 1 && event.total) {
        this.uploadProgress = Math.round((event.loaded / event.total) * 100);
      } else if (event.type === 4) {
        this.isProcessing = false;
        alert('Upload successful!');
      }
    }, error => {
      this.isProcessing = false;
      alert('Failed to upload video!');
    });
  }
}  
