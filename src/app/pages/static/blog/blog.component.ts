import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { MarkdownService } from 'ngx-markdown';
import { ActivatedRoute } from '@angular/router';
import blogMetaData from '../../../../assets/data/blog-meta-data.json';
import Utils from '../../../utils';
import pages from '../../../../assets/data/pages.json';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss']
})
export class BlogComponent implements OnInit {

  articlePath: string;
  previous: string;
  next: string;

  constructor(private titleService: Title,
    private markdownService: MarkdownService,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.titleService.setTitle(pages.blog.title);

    this.route.paramMap.subscribe(params => {

      let index = 0;

      if (!params || !params.get('year')) {

        const parts = blogMetaData[0].split('/');
        if (parts.length) {
          this.articlePath = `/assets/${blogMetaData[index]}/${parts[parts.length - 1]}.md`;
        }

      } else {
        this.articlePath = `/assets/blog/${params.get('year')}/${params.get('month')}/`
          + `${params.get('day')}/${params.get('article')}/${params.get('article')}.md`;
        index = this.getIndexOf(params.get('article'));

      }

      if (index !== -1) {
        this.next = index > 0 ? blogMetaData[index - 1] : null;
        this.previous = index < blogMetaData.length - 1 ? blogMetaData[index + 1] : null;
      }

      Utils.focusAndBlurOnTop();
    });
  }

  getIndexOf(article: string) {
    for (let i = 0; i < blogMetaData.length; i++) {
      const candidate = blogMetaData[i].slice(blogMetaData[i].lastIndexOf('/') + 1);
      if (candidate === article) {
        return i;
      }
    }
    return -1;
  }

}
