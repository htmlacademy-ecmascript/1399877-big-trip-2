export default class PointModel {
  constructor(service) {
    this.service = service;
    this.points = this.service.getPoints();
  }

  get() {
    return this.points;
  }

  update(updatedPoint) {
    this.points = this.points.map((p) =>
      p.id === updatedPoint.id ? updatedPoint : p
    );
  }
}
