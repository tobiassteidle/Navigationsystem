import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';

class ShoppingCart {
  items: object[]
}

class BackendData {
  imageBase64: string;
  shoppingCart: ShoppingCart
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  activeProduct = 0;
  products = [];
  configUrl = 'https://bithackaton.cfapps.eu10.hana.ondemand.com/navigate';
  currentProduct = {};

  constructor(private http: HttpClient) { }

  ngOnInit() {
  }

  addProduct(val){
    this.products.push(val);
    this.updateMap();
  }

  back() {
    this.activeProduct -= 1;
    if(this.activeProduct < 0 ){
      this.activeProduct = 0;
    }
    this.updateMap();
  }
  next() {
    this.activeProduct += 1;
    if(this.activeProduct >= this.products.length ){
      this.activeProduct = this.products.length - 1;
    }
    this.updateMap();
  }

  delete(index) {
    this.products.splice(index, 1);
    this.updateMap();
  }

  updateMap() {
    const remainingProducts = this.products.slice(this.activeProduct);
    let itemsString = remainingProducts[0];
    for (let i = 1; i < remainingProducts.length; i++) {
      itemsString += ',' + remainingProducts[i];
    }
    //itemsString += '"';

    console.log('Send Post...');

    const httpHeaders = new HttpHeaders({
      'Content-Type' : 'application/json',
      'Cache-Control': 'no-cache'
    });

    const options = {
      headers: httpHeaders
    };

    this.http.post(this.configUrl, {
      'currentLocation': {
        'type': 'Point',
        'coordinates': [10, 10]
      },
      'items': itemsString
    }, options).subscribe( data => {
      console.log('Receive: ' + JSON.stringify(data));


      const rawImage = 'data:image/jpeg;base64 ,' + (<BackendData>data).imageBase64;
      (<HTMLImageElement>document.getElementById('map')).src = rawImage;

      const items = (<BackendData>data).shoppingCart.items;
      if(items != null && items.length > 0) {
        this.currentProduct = items[0];
      }

    });
  }



}
