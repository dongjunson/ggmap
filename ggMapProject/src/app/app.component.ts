import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
	KakaoMapsProvider,
	LatLng,
	MapTypeId,
	MapTypeControl,
	ControlPosition,
	OverlayMapTypeId,
	KakaoEvents,
	Marker,
	ZoomControl
} from 'kakao-maps-sdk';
import { NgbModal, ModalDismissReasons, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
// https://openapi.gg.go.kr/RegionMnyFacltStus?key=8ae01e654de0449492b1cb5e3b0e6086&type=json&SIGUN_CD=41130


@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})


export class AppComponent {

	rows: any = {};
	loading = false;
	types = [
		{ value: '41820', key: '가평군' },
		{ value: '41280', key: '고양시' },
		{ value: '41290', key: '과천시' },
		{ value: '41210', key: '광명시' },
		{ value: '41610', key: '광주시' },
		{ value: '41310', key: '구리시' },
		{ value: '41410', key: '군포시' },
		{ value: '41570', key: '김포시' },
		{ value: '41360', key: '남양주시' },
		{ value: '41250', key: '동두천시' },
		{ value: '41190', key: '부천시' },
		{ value: '41130', key: '성남시' },
		{ value: '41110', key: '수원시' },
		{ value: '41390', key: '시흥시' },
		{ value: '41270', key: '안산시' },
		{ value: '41550', key: '안성시' },
		{ value: '41170', key: '안양시' },
		{ value: '41630', key: '양주시' },
		{ value: '41830', key: '양평군' },
		{ value: '41670', key: '여주시' },
		{ value: '41800', key: '연천군' },
		{ value: '41370', key: '오산시' },
		{ value: '41460', key: '용인시' },
		{ value: '41430', key: '의왕시' },
		{ value: '41150', key: '의정부시' },
		{ value: '41500', key: '이천시' },
		{ value: '41480', key: '파주시' },
		{ value: '41220', key: '평택시' },
		{ value: '41650', key: '포천시' },
		{ value: '41450', key: '하남시' },
		{ value: '41590', key: '화성시' },
	];
	closeResult: string;
	SIGUN = '41130';
	position;
	mapConfig = { width: '100%', height: '100vh' };
	pSize = 10;
	flagg = true;
	marker: Marker;
	markers = [];
	lastPosition: any;
	KaKaoJavascriptAPIKey = '8a50448f6c741324269ad6686264c1c0';
	modalOptions: NgbModalOptions;
	constructor(
		private http: HttpClient,
		public kakao: KakaoMapsProvider,
		private modalService: NgbModal
	) {

		this.mapRender(kakao);
		this.modalOptions = {
		};
	}

	public changeSIGUN(value) {
		// console.log(value);
		this.SIGUN = value;
		this.markerRender(this.kakao);
	}

	open(content) {

		let isHTML = '가맹점 이름 : ' + content.CMPNM_NM + '\n';
		isHTML += '가맹점 연락처 : ' + content.TELNO + '\n';
		this.modalService.open(isHTML, this.modalOptions).result.then((result) => {
			this.closeResult = `Closed with: ${result}`;
		}, (reason) => {
			this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
		});
	}

	private getDismissReason(reason: any): string {
		if (reason === ModalDismissReasons.ESC) {
			return 'by pressing ESC';
		} else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
			return 'by clicking on a backdrop';
		} else {
			return `with: ${reason}`;
		}
	}

	private mapRender(_kakao: KakaoMapsProvider) {
					this.loading = true;
					const mapConfig = {
						center: new LatLng(37.350078, 127.1067633),
						mapTypeId: MapTypeId.ROADMAP
					};

					setTimeout(() => {
						if (this.loading) {
							_kakao.loadKakaoMapSDK(this.KaKaoJavascriptAPIKey);
							_kakao
								.init('kakaomaps-div', mapConfig)
								.then(() => {

									_kakao.getMapInstance().addControl(new MapTypeControl(), ControlPosition.BOTTOM);
									_kakao.getMapInstance().addControl(new ZoomControl(), ControlPosition.TOPRIGHT);
									// _kakaoMapsProvider.getMapInstance().addOverlayMapTypeId(OverlayMapTypeId.BICYCLE_HYBRID);

									const events: KakaoEvents[] = [
										'center_changed',
										'zoom_start',
										'zoom_changed',
										'bounds_changed',
										'click',
										'dblclick',
										'rightclick',
										'mousemove',
										'dragstart',
										'drag',
										'dragend',
										'idle',
										'tilesloaded',
										'maptypeid_changed',
									];
									_kakao.getMapInstance().relayout();
									this.markerRender(this.kakao);
								})
								.catch(
								);
						}
					},200);



		// _kakao.getMapInstance().addControl(_kakao.getZoomControl(), ControlPosition.TOPRIGHT);
		// _kakaoMapsProvider.getMapInstance().addControl(_kakaoMapsProvider.getMapTypeControl(), ControlPosition.TOPRIGHT);
	}

	private markerRender(_kakao: KakaoMapsProvider) {
		// tslint:disable-next-line: prefer-for-of
		for (let i = 0; i < this.markers.length; i++) {
			this.markers[i].setMap(null);
		};
		this.markers = [];
		this.http.get('https://openapi.gg.go.kr/RegionMnyFacltStus?pSize=' + this.pSize + '&pIndex=1&key=8ae01e654de0449492b1cb5e3b0e6086&type=json&SIGUN_CD=' + this.SIGUN)
			.subscribe(data => {

				this.rows = data;

				this.rows.RegionMnyFacltStus[1].row.forEach(obj => {

					// console.log(obj);
					// console.log('-------------------');

					this.marker = new Marker({ position: new LatLng(obj.REFINE_WGS84_LAT, obj.REFINE_WGS84_LOGT), clickable: true });
					this.marker.setTitle(obj.CMPNM_NM + '/' + obj.TELNO);
					this.marker.setMap(_kakao.getMapInstance());
					this.markers.push(this.marker);
					const infowindow = {
						CMPNM_NM: obj.CMPNM_NM,
						TELNO: obj.TELNO,
					};

					_kakao.addListener(this.marker, 'click', res => {
						// console.log(infowindow);
						this.open(infowindow);
					});

				});

				const loopCount = 2;
				let apiUrl: string = 'https://openapi.gg.go.kr/RegionMnyFacltStus?pSize=' + this.pSize + '&pIndex=' + loopCount + '&key=8ae01e654de0449492b1cb5e3b0e6086&type=json&SIGUN_CD=' + this.SIGUN;
				const totalCount = this.rows.RegionMnyFacltStus[0].head[0].list_total_count;

				for (let i = 0; i <= (totalCount / this.pSize); i++) {
					this.http.get(apiUrl)
						.subscribe(data => {
							this.rows = data;
							this.rows.RegionMnyFacltStus[1].row.forEach(obj => {

								// console.log(obj);
								// console.log('-------------------');

								this.marker = new Marker({ position: new LatLng(obj.REFINE_WGS84_LAT, obj.REFINE_WGS84_LOGT), clickable: true });
								this.marker.setTitle(obj.CMPNM_NM + '/' + obj.TELNO);
								this.marker.setMap(_kakao.getMapInstance());
								this.markers.push(this.marker);

								const infowindow = {
									CMPNM_NM: obj.CMPNM_NM,
									TELNO: obj.TELNO,
								};

								_kakao.addListener(this.marker, 'click', res => {
									// console.log(infowindow);
									this.open(infowindow);
								});

								if (i === 0) {
									_kakao.getMapInstance().panTo(new LatLng(obj.REFINE_WGS84_LAT, obj.REFINE_WGS84_LOGT), 0);
								}
							});

						});

					apiUrl = 'https://openapi.gg.go.kr/RegionMnyFacltStus?pSize=' + this.pSize + '&pIndex=' + (loopCount + i) + '&key=8ae01e654de0449492b1cb5e3b0e6086&type=json&SIGUN_CD=' + this.SIGUN;
				}
			});
		_kakao.getMapInstance().relayout();
	}
}
