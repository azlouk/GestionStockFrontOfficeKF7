import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Article} from "../../models/Article";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class ArticleService {

    apiUrl=environment.apiUrl
    constructor(private http: HttpClient) { }
    getAllArticles(): Observable<Article[]> {
        return this.http.get<Article[]>(`${this.apiUrl}/articles/read`);
    }



    getArticleById(id: number): Observable<Article> {
        const url = `${this.apiUrl}/articles/${id}`;
        return this.http.get<Article>(url);
    }

    addArticle(article: Article) : Observable<Article>{
        return this.http.post<Article>(`${this.apiUrl}/articles/add`, article);
    }

    updateArticle(article: Article): Observable<Article> {
        return this.http.put<Article>(`${this.apiUrl}/articles/update/${article.id}`, article);
    }

    deleteArticle(articleId: number ): Observable<any> {
        return this.http.delete(`${this.apiUrl}/articles/delete/${articleId}`);
    }
}
