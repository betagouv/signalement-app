import { Component, OnInit } from '@angular/core';
import { MarkdownService } from 'ngx-markdown';
import { ActivatedRoute } from '@angular/router';
import blogMetaData from '../../../../assets/data/blog-meta-data.json';
import Utils from '../../../utils';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss']
})
export class BlogComponent implements OnInit {

  articlePath: string;
  previous: string;
  next: string;

  constructor(private markdownService: MarkdownService,
    private route: ActivatedRoute) { }

  ngOnInit() {

    this.route.paramMap.subscribe(params => {

      let index = 0;

      if (!params || !params.get('year')) {

        const parts = blogMetaData[0].split('/')
        if (parts.length) {
          this.articlePath = `/assets/${blogMetaData[index]}/${parts[parts.length - 1]}.md`;
        }

      } else {

        this.articlePath = `/assets/blog/${params.get('year')}/${params.get('month')}/${params.get('day')}/${params.get('article')}/${params.get('article')}.md`;
        index = this.getIndexOf(params.get('article'));

      }

      if (index !== -1) {
        if (index > 0) {
          this.next = blogMetaData[index - 1];
        }

        if (index < blogMetaData.length - 1) {
          this.previous = blogMetaData[index + 1];
        }
      }

      Utils.focusAndBlurOnTop();
    });
  }

  getIndexOf(article) {
    for (let i = 0; i < blogMetaData.length; i++) {
      const candidate = blogMetaData[i].slice(blogMetaData[i].lastIndexOf("/") + 1)
      if (candidate === article) {
        return i
      }
    }
    return -1;
  }

}
