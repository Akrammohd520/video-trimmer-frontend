import { CommonModule } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-load-video',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './load-video.component.html',
  styleUrls: ['./load-video.component.css']
})
export class LoadVideoComponent {

  selectedFileName: string | null = null;
  numParts: number | null = null;
  textToAdd: string | null = null; // Add property to hold the text to be added
  successMessage: string | null = null; // Property to hold the success message

  constructor(private route: ActivatedRoute, private http: HttpClient, private router: Router) {
    this.route.queryParams.subscribe(params => {
      this.selectedFileName = params['fileName'];
    });
  }

  trimVideo() {
    if (this.selectedFileName && this.numParts && this.textToAdd) { // Check if textToAdd is not null
      const apiUrl = `http://localhost:8088/trim?parts=${this.numParts}`;
      const requestBody = { fileName: this.selectedFileName, text: this.textToAdd }; // Include textToAdd in the request body

      this.http.post(apiUrl, requestBody, { responseType: 'text' }).subscribe(
        (response: string) => {
          console.log('Video trimmed successfully:', response);
          this.successMessage = 'Video trimmed successfully'; // Set the success message
          this.router.navigate(['']);
        },
        (error: HttpErrorResponse) => {
          console.error('Error trimming video:', error.message);
          // Handle error (e.g., show an error message to the user)
        }
      );
    } else {
      console.warn('Please select a file, specify the number of parts, and enter the text to add.');
      // Handle missing file name, numParts, or textToAdd (e.g., show a warning to the user)
    }
  }
}
