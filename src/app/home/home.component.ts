import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { courseModel } from '../models/course.model';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  storageFolders = ['all/', 'course1/', 'course2/'];
  filelist: any[] = [];
  courseList: courseModel[] = [];
  videoUrl:any;

  constructor(private storage: AngularFireStorage,
    private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.getFileList();
  }

  getFileList() {
    for (let j = 0; j < this.storageFolders.length; j++) {
      const e = this.storageFolders[j];

      //Create course data to show all course
      let courseData: courseModel = {
        id: (j + 1).toString(),
        title: "Course SQL " + (j + 1).toString(),
        description: "Module intro goes here. Lorem ipsum dolor sit amet, consectetur adipiscing elit. " +
          "Pellentesque interdum elit non neque venenatis, ut mattis sapien lobortis.Integer eget turpis non ipsum convallis convallis vitae eu nunc.",
        links: []
      }

      //Get all videos files based folder from firebase storage
      const ref = this.storage.ref(e);
      let myurlsubscription = ref.listAll().subscribe((data) => {
        for (let i = 0; i < data.items.length; i++) {
          let name = data.items[i].name;
          let newref = this.storage.ref(e + data.items[i].name);
          let url = newref.getDownloadURL().subscribe((urlres) => {
            courseData.links.push({
              id: i.toString(),
              title: "sub module course title",
              duration: "01:30",
              type: "preview",
              link: urlres,
              fileName: name
            })
            courseData.links.sort((a: any, b: any) => a.id - b.id)
          });

          if (i == (data.items.length - 1)) {
            this.courseList.push(courseData);
            this.courseList = this.courseList.sort((a: any, b: any) => a.id - b.id)
          }
        }
      });
    }
  }

  openLink(videoLink: string) {
    this.videoUrl = this.sanitizer.bypassSecurityTrustUrl(videoLink);
  }

  closeDialog(){
    this.videoUrl = undefined;
  }

}
