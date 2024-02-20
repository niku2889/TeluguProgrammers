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
  storageFolders = ['all/'];
  filelist: any[] = [];
  courseList: courseModel[] = [];
  videoUrl: any;
  visible: boolean = false;
  courseTitle = "";

  constructor(private storage: AngularFireStorage,
    private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.getFileList();
  }

  getFileList() {
    for (let j = 0; j < this.storageFolders.length; j++) {
      const e = this.storageFolders[j];

      //Create course data to show all course


      //Get all videos files based folder from firebase storage
      const ref = this.storage.ref(e);
      let myurlsubscription = ref.listAll().subscribe((data) => {
        for (let i = 0; i < data.items.length; i++) {
          let name = data.items[i].name;
          let newref = this.storage.ref(e + data.items[i].name);
          let url = newref.getDownloadURL().subscribe((urlres) => {
            let courseData: courseModel = {
              id: (i + 1).toString(),
              title: "Course SQL " + (i + 1).toString(),
              description: "Module intro goes here. Lorem ipsum dolor sit amet, consectetur adipiscing elit. " +
                "Pellentesque interdum elit non neque venenatis, ut mattis sapien lobortis.Integer eget turpis non ipsum convallis convallis vitae eu nunc.",
              duration: "01:30",
              type: "preview",
              link: urlres,
              fileName: name
            }
            this.courseList.push(courseData);
            this.courseList = this.courseList.sort((a: any, b: any) => a.id - b.id)
          });
        }
      });
    }
  }

  openLink(videoLink: string, title: string) {
    this.courseTitle = title;
    this.visible = true;
    this.videoUrl = this.sanitizer.bypassSecurityTrustUrl(videoLink);
  }

  closeDialog() {
    this.courseTitle = "";
    this.visible = false;
    this.videoUrl = undefined;
  }

  openCourse(course: any) {
    this.courseTitle = course.title;
    this.visible = true;
    this.videoUrl = this.sanitizer.bypassSecurityTrustUrl(course.link);
  }

}
