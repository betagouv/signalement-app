import { Component, OnDestroy, OnInit } from '@angular/core';
import { AsyncFilesService } from '../../services/asyncfiles.service';
import { FormBuilder } from '@angular/forms';
import { AsyncFile } from '../../model/AsyncFile';
import { Constants } from '../../model/Constants';

@Component({
  selector: 'app-async',
  templateUrl: './asyncfiles.component.html'
})
export class AsyncFilesComponent implements OnInit, OnDestroy {

  constructor(
    public formBuilder: FormBuilder,
    private asyncFileService: AsyncFilesService,
  ) {
  }

  downloads?: AsyncFile[];
  loading = false;
  intervalId: any;
  constants = Constants;

  ngOnInit() {
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
    this.asyncFileService.listAsyncFiles().subscribe(downloads => {
      this.loading = false;
      this.downloads = downloads;
      if (this.downloads.filter(f => !f.url).length === 0) {
        this.stopInterval();
      }
    });
  }
}
