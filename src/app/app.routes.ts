import { Routes } from '@angular/router';
import { UploadComponent } from './upload/upload.component';
import { LoadVideoComponent } from './load-video/load-video.component';

export const routes: Routes = [ 
    { path: '', component: UploadComponent },
    { path: 'load-video', component: LoadVideoComponent }
];
