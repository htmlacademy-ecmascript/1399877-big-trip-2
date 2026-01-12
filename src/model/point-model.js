export default class PointModel {
  constructor(service) {
    this.service = service;
    this.setPoints(this.service.getPoints());
  }

  getPoints() {
    return this.points;
  }

  setPoints(points) {
    if (Array.isArray(points) === false) {
      throw new Error('PointModel.setPoints: points must be an array');
    }

    this.points = points.slice();
  }

  updatePoint(updatedPoint) {
    if (updatedPoint === null) {
      throw new Error('PointModel.updatePoint: updatedPoint must not be null');
    }

    if (typeof updatedPoint !== 'object') {
      throw new Error('PointModel.updatePoint: updatedPoint must be an object');
    }

    this.points = this.points.map((p) =>
      p.id === updatedPoint.id ? updatedPoint : p
    );
  }

  deletePoint(pointId) {
    if (pointId === null || pointId === undefined) {
      throw new Error('PointModel.deletePoint: pointId must not be null or undefined');
    }

    this.points = this.points.filter((point) => point.id !== pointId);
  }
}
