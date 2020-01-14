import { Component, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import pages from '../../../../assets/data/pages.json';
import { AnomalyService } from '../../../services/anomaly.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {

  internetInformation;

  constructor(private titleService: Title,
              private meta: Meta,
              private anomalyService: AnomalyService) { }

  ngOnInit() {
    this.titleService.setTitle(pages.contact.title);
    this.meta.updateTag({ name: 'description', content: pages.contact.description });

    this.internetInformation = this.anomalyService.getAnomalyByCategoryId('INTERNET').information;

  }

}
