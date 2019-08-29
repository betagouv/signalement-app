import { Component, OnInit } from '@angular/core';
import { MarkdownService } from 'ngx-markdown';
import { ActivatedRoute } from '@angular/router';
import blogMetaData from '../../../../assets/data/blog-meta-data.json';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss']
})
export class BlogComponent implements OnInit {

  articleUrl: string;
  previous: string;
  next: string;

  constructor(private markdownService: MarkdownService,
              private route: ActivatedRoute) { }

  ngOnInit() {

    this.route.paramMap.subscribe(params => {
        this.articleUrl = `/assets/blog/${params.get('year')}/${params.get('month')}/${params.get('day')}/${params.get('article')}/${params.get('article')}.md`;

        const index = this.getIndexOf(params.get('article'));

        if (index !== -1) {
          if (index > 0) {
            this.next = blogMetaData[index - 1];
          }

          if (index < blogMetaData.length - 1) {
            this.previous = blogMetaData[index + 1];
          }
        }
      }
    );

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
