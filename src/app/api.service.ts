import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http:HttpClient) { }



  get_casual(apiFun: any, model: any, cb:any) {
    let data = { param: model, param1: apiFun };
    // var md = await this.encrypt(JSON.stringify(data));
    return this.http.get('https://etabella.com/api/casualget' + '?id=' + JSON.stringify(data)).subscribe((res: any) => {
      res = res ? res : [];
      cb(res);
    }, err => {
      cb([{ msg: -1, 'value1': JSON.stringify(err) }]);
    });
  }


}
