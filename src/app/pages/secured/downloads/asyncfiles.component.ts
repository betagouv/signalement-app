import { Component, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import pages from '../../../../assets/data/pages.json';
import { AsyncFilesService } from '../../../services/asyncfiles.service';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AsyncFile } from 'src/app/model/AsyncFile.js';

@Component({
  selector: 'app-async',
  templateUrl: './asyncfiles.component.html'
})
export class AsyncFilesComponent implements OnInit {

  constructor(public formBuilder: FormBuilder,
              private titleService: Title,
              private meta: Meta,
              private asyncFileService: AsyncFilesService,
              private route: ActivatedRoute) { }

  downloads: AsyncFile[];
  loading: boolean;

  ngOnInit() {
    this.titleService.setTitle(pages.secured.downloads.title);
    this.meta.updateTag({ name: 'description', content: pages.secured.downloads.description });
    this.refresh();
  }

  refresh() {
    this.loading = true;
    this.asyncFileService.listAsyncFiles().subscribe(
      downloads => {
          this.loading = false;
          this.downloads = downloads;
        }
    );
  }
}
