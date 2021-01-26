import { Component, OnDestroy, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import pages from '../../../assets/data/pages.json';
import { AsyncFilesService } from '../../services/asyncfiles.service';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { AsyncFile } from '../../model/AsyncFile';
import { Constants } from '../../model/Constants';

@Component({
  selector: 'app-async',
  templateUrl: './asyncfiles.component.html'
})
export class AsyncFilesComponent implements OnInit, OnDestroy {

  constructor(public formBuilder: FormBuilder,
              private titleService: Title,
              private meta: Meta,
              private asyncFileService: AsyncFilesService,
              private route: ActivatedRoute) { }

  downloads?: AsyncFile[];
  loading = false;
  intervalId: any;
  constants = Constants;

  ngOnInit() {
    this.titleService.setTitle(pages.secured.downloads.title);
    this.meta.updateTag({ name: 'description', content: pages.secured.downloads.description });
    this.refresh(true);
    this.intervalId = setInterval(() => {
      this.refresh(false);
    }, 5000);
  }

  ngOnDestroy() {
    this.stopInterval();
  }

  stopInterval() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  refresh(showLoading: boolean = false) {
    this.loading = showLoading;
    this.asyncFileService.listAsyncFiles().subscribe(
      downloads => {
          this.loading = false;
          this.downloads = downloads;
          if (this.downloads.filter(f => !f.url).length == 0) {
            this.stopInterval();
          }
        }
    );
  }
}
