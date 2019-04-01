import { Component, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { GalleryServices } from '../../gallery/gallery.service';
import { PopupService } from '../../popup/popup.service';
import { GalleryComponent } from '../../gallery/gallery.component';
import { Observable } from 'rxjs';

@Component({
  providers: [GalleryComponent],
  selector: 'app-detailpage',
  templateUrl: '../../gallery/gallery.component.html',
  styleUrls: ['../../../app/app.component.scss']
})

export class DetailpageComponent implements OnInit {
  private buffer: any = [];
  private photos: any = [];
  private pageNo: number = 2;
  private collection: any = [];
  private id: Number;
  private sharePhoto: Observable<any>;
  private isShareActive: boolean = false;
  private openedPopupId: string;

  constructor(private route: ActivatedRoute, private galleryServices: GalleryServices, private galleryComponent: GalleryComponent, private popupService: PopupService) { }

  ngOnInit(): void {
    this.id = +this.route.snapshot.params["id"];
    this.getCollectionPhotos(this.id);
  }

  shareToggle(isShareActive: boolean) {
    this.isShareActive = !this.isShareActive;
  }

  openShareModal(id: string, image: any) {
    this.sharePhoto = this.popupService.openShareModal(id, image);
    this.openedPopupId = id
  }

  closeModal(id: string) {
    this.isShareActive = this.popupService.closeModal(id);
  }

  copyText(value: string) {
    this.galleryServices.copyMessage(value);
  }

  @HostListener('document:keyup', ['$event']) handleKeyUp(event) {
    if (event.keyCode === 27) {
      this.closeModal(this.openedPopupId);
    }
  }

  getCollectionPhotos(collectionId: Number) {
    this.galleryServices.getCollectionDetails(collectionId).subscribe((data: {}) => {
      this.photos = data;
    })

    this.galleryServices.getCollectionInfo(collectionId).subscribe((data: {}) => {
      this.collection = data;
    })
  }

  @HostListener("window:scroll", ['$event'])
  onWindowScroll() {
    let pos = window.innerHeight + window.scrollY;
    let max = document.body.offsetHeight;
    if (pos >= max) {
      this.loadMoreCollections(this.pageNo, this.id);
    }
  }

  loadMoreCollections(pages, id) {
    this.galleryServices.getLoadMoreCollectionDetailImages(pages, id).subscribe((data: {}) => {
      this.buffer = data;
      this.photos = this.photos.concat(data);
      this.pageNo++;
    });
  }

  addFavorite(photo) {
    this.galleryComponent.addFavorite(photo);
  }
}



