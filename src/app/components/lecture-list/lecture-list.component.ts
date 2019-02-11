import { Component, OnInit, Input } from '@angular/core';
import { utils } from 'src/app/utils';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { CacheService } from 'ionic-cache';
import { Storage } from '@ionic/storage';
import { IConfig } from 'src/app/interfaces';

@Component({
  selector: 'app-lecture-list',
  templateUrl: './lecture-list.component.html',
  styleUrls: ['./lecture-list.component.scss']
})
export class LectureListComponent implements OnInit {

  @Input() headerIdInput: string;
  @Input() hasSubTreeInput;
  headerId: string;
  hasSubTree;

  authToken;
  endpointUrl;

  lectureSchedule;
  isExpanded = [];
  isExpandedCourse = [];

  courseData = [];
  courseGroups = [];
  lecturerList = [];

  constructor(
    private http: HttpClient,
    private cache: CacheService,
    private storage: Storage
  ) { }

  ngOnInit() {
    this.storage.get('config').then((config: IConfig) => {
      this.authToken = config.webservices.apiToken;
      this.endpointUrl = config.webservices.endpoint.puls;
      this.getLectureData();
    });
  }

  getLectureData() {

    if (this.headerIdInput) {
      this.headerId = this.headerIdInput;
    }

    if (this.hasSubTreeInput) {
      this.hasSubTree = true;
    }

    const headers = new HttpHeaders()
      .append('Authorization', this.authToken);

    if (!this.headerId) {
      const url = this.endpointUrl + 'getLectureScheduleRoot';
      const request = this.http.post(url, {'condition': {'semester': 0}}, {headers: headers});

      this.cache.loadFromObservable('getLectureScheduleRoot', request).subscribe(data => {
        console.log(data);
        this.lectureSchedule = data;
      });
    } else if (this.hasSubTree) {
      const url = this.endpointUrl + 'getLectureScheduleSubTree';
      const request = this.http.post(url, {'condition': {'headerId': this.headerId}}, {headers: headers});

      this.cache.loadFromObservable('getLectureScheduleSubTree' + this.headerId, request).subscribe(data => {
        console.log(data);
        this.lectureSchedule = data;
      });
    } else {
      const url = this.endpointUrl + 'getLectureScheduleCourses';
      const request = this.http.post(url, {'condition': {'headerId': this.headerId}}, {headers: headers});

      this.cache.loadFromObservable('getLectureScheduleCourses' + this.headerId, request).subscribe(data => {
        console.log(data);
        this.lectureSchedule = data;
      });
    }
  }

  expandChild(childNode) {

    console.log(childNode);

    if (childNode.subNodes) {
      if (Number(childNode.subNodes.count) > 0) {
        this.hasSubTree = true;
      } else { this.hasSubTree = false; }
    } else { this.hasSubTree = false; }

    if (childNode.headerId) {
      this.headerId = childNode.headerId;
      const wasExpanded = this.isExpanded[childNode.headerId];

      for (let i = 0; i < this.isExpanded.length; i++) {
        this.isExpanded[i] = false;
      }

      if (wasExpanded) {
        this.isExpanded[childNode.headerId] = false;
      } else { this.isExpanded[childNode.headerId] = true; }
    }
  }

  expandCourse(course) {

    if (course.courseId) {
      const courseId = course.courseId;

      const url = this.endpointUrl + 'getCourseData';

      const headers = new HttpHeaders()
        .append('Authorization', this.authToken);

      const request = this.http.post(url, {'condition': {'courseId': courseId}}, {headers: headers});

      this.cache.loadFromObservable('getCourseData' + courseId, request).subscribe(data => {
        console.log(data);
        this.courseData[courseId] = data;

        let i;
        this.courseGroups[courseId] = [];
        // check how many different groups exist
        const tmp = utils.convertToArray(utils.convertToArray(this.courseData[courseId].courseData.course)[0].events.event);
        for (i = 0; i < tmp.length; i++) {
          if (!utils.isInArray(this.courseGroups[courseId], tmp[i].groupId)) {
            this.courseGroups[courseId].push(tmp[i].groupId);
          }
        }
      });

      const wasExpanded = this.isExpandedCourse[courseId];
      for (let i = 0; i < this.isExpandedCourse.length; i++) {
        this.isExpandedCourse[i] = false;
      }

      if (wasExpanded) {
        this.isExpandedCourse[courseId] = false;
      } else { this.isExpandedCourse[courseId] = true; }
    }
  }

  replaceUnderscore(roomSc: string) {
    if (roomSc !== undefined) {
      return roomSc.replace(/_/g, '.');
    } else { return ''; }
  }

  checkDoubledLecturers(event, lecturer, index) {
    if (event.eventId && lecturer.lecturerId) {
      if ((this.lecturerList[event.eventId] !== undefined)  && (this.lecturerList[event.eventId].length > 0)) {
        if (utils.isInArray(this.lecturerList[event.eventId], [lecturer.lecturerId][index])) {
          return true;
        } else {
          let i;
          let alreadyIn = false;
          for (i = 0; i < this.lecturerList.length; i++) {
            if ((this.lecturerList[i] !== undefined) && (this.lecturerList[i][0] === lecturer.lecturerId)) {
              alreadyIn = true;
            }
          }

          if (alreadyIn) { return false; } else {
            this.lecturerList[event.eventId].push([lecturer.lecturerId][index]);
            return true;
          }
        }
      } else {
        this.lecturerList[event.eventId] = [];
        this.lecturerList[event.eventId].push([lecturer.lecturerId][index]);
        return true;
      }
    }
  }

  htmlDecode(input) {
    const doc = new DOMParser().parseFromString(input, 'text/html');
    return doc.documentElement.textContent;
  }

  /**
   * has to be declared for html pages to use the imported function
   * couldn't find a better solution
   * @param array
   */
  convertToArray(array) {
    return utils.convertToArray(array);
  }

}
