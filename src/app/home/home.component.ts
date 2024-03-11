import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { courseModel } from '../models/course.model';
import { DomSanitizer } from '@angular/platform-browser';
import { AuthenticationService } from '../services/auth.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  storageFolders = ['all/', 'thumbnails/'];
  filelist: any[] = [];
  courseList: courseModel[] = [];
  videoUrl: any;
  visible: boolean = false;
  courseTitle = "";
  showLogin: boolean = false;
  @ViewChild('closebutton') closebutton: any;

  constructor(private storage: AngularFireStorage,
    private sanitizer: DomSanitizer,
    private router : Router,
    public authenticationService: AuthenticationService) {
    this.authenticationService.isAuthenticated().subscribe(ref => {
      if (ref != null)
        this.closebutton.nativeElement.click();
    })
  }

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
            if (j == 0) {
              let courseData: courseModel = {
                id: (i + 1).toString(),
                title: "Course " + (i + 1).toString(),
                description: "",
                duration: "01:30",
                type: "preview",
                link: urlres,
                fileName: name,
                thumbnail: ""
              }
              this.courseList.push(courseData);
            } else {
              //console.log(this.courseList[i])
              if (this.courseList[i])
                this.courseList[i].thumbnail = urlres;
            }
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
  redirectToAnotherPage()
  {
     // Assuming 'another-page' is the route/path you want to navigate to
     this.router.navigate(['/TestPageK']);
  }

  openCourse(course: any) {
    if (this.authenticationService.isAuthenticated()) {
      this.courseTitle = course.title;
      this.visible = true;
      this.videoUrl = this.sanitizer.bypassSecurityTrustUrl(course.link);
    }
  }
}
