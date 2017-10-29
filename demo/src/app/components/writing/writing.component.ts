import { Http, RequestOptions, Response, Headers, URLSearchParams } from '@angular/http';
import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import 'rxjs/add/operator/map';
import { unescape } from 'querystring';
import { DataHandWriting } from '../../entities/dataHandWriting';
import { DomSanitizer } from '@angular/platform-browser';
import { Message, SelectItem } from 'primeng/primeng';

@Component({
  selector: 'app-writing',
  templateUrl: './writing.component.html',
  styleUrls: ['./writing.component.css']
})
export class WritingComponent implements OnInit {
  urlHandWriting: string;
  imageUrl: string;
  pdfUrl: string;
  text: string;
  showPdf = false;
  showImg = false;
  msgs: Message[] = [];
  texts: SelectItem[];
  @Input() dhw: DataHandWriting;
  type = 'png';
  constructor(public sanitizer: DomSanitizer) {
  }

  ngOnInit() {
    this.texts = [];
    this.texts = [
      {label: 'Select', value: null},
      // tslint:disable-next-line:max-line-length
      {label: 'Texting', value: 'Have plans for this weekend? \n\nNot sure yet. What were you thinking? \n\nMy band is playing @ The Bell House on Friday. Only $5, come by!'},
      {label: 'Ainslie', value: 'Dear John, Millie, and team, \n\nAs we look back upon the past year, we would like to acknowledge those who have helped us\n\nAll the best,'},
  ];
  }

  // Listning for changes
  ngOnChanges(changes: SimpleChanges) {
    this.dhw = changes.dhw.currentValue;
    this.type = this.dhw.type;
    console.log(this.dhw.type);
  }

  // getting the values from each component and send the data to the api to get the response.
  loadFile() {

    this.imageUrl = '';
    if (this.dhw.handwriting_id === null) {
      this.msgs = [];
      this.msgs.push({severity: 'error', summary: 'Error loading', detail: 'Please select a handwriting type'});
      return;
    }
    if (this.text === undefined || this.text === '') {
      this.msgs = [];
      this.msgs.push({severity: 'error', summary: 'Error loading', detail: 'Please write a text'});
      return;
    }

    this.urlHandWriting = 'https://api.handwriting.io/render/';
    this.urlHandWriting += this.dhw.type + '?';
    this.urlHandWriting += '&handwriting_id=' + this.dhw.handwriting_id;
    this.urlHandWriting += '&text=' + this.text.replace(/\r\n|\r|\n/g, '%0A');
    this.urlHandWriting += '&handwriting_size=' + this.dhw.size;
    this.urlHandWriting += '&handwriting_color=' + this.dhw.color.replace('#', '%23');
    this.urlHandWriting += '&width=' + this.dhw.width;
    this.urlHandWriting += '&height=' + this.dhw.height;
    this.urlHandWriting += '&line_spacing=' + this.dhw.lineSpacing;
    this.urlHandWriting += '&line_spacing_variance=' + this.dhw.lineSpacingVar;
    this.urlHandWriting += '&word_spacing_variance=' + this.dhw.wordSpacing;
    this.urlHandWriting += '&random_seed=' + this.dhw.randomSeed;

    if (this.dhw.type === 'png') {
      this.imageUrl = this.urlHandWriting;
      this.showImg = true;
      this.showPdf = false;
    } else {
      this.pdfUrl = '';
      this.pdfUrl = this.urlHandWriting;
      this.showImg = false;
      this.showPdf = true;
    }
  }

}
