import { Component } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  profileUrl: Observable<string | null>;
  meta: Observable<any>;

  constructor(private storage: AngularFireStorage) {
    const ref = this.storage.ref('all/SampleVideo_720x480_1mb.mp4');
   
    this.profileUrl = ref.getDownloadURL();
    this.meta = ref.getMetadata();

    this.profileUrl.subscribe(ref => {
      console.log(ref)
    })
    console.log(this.profileUrl)
    this.meta.subscribe(ref => {
      console.log(ref)
      const size = ref.size;
      const start = Number(0);
      const end = Math.min(start + 10 ** 6, size - 1);
      const contentLength = end - start + 1;
    })
  }
}
