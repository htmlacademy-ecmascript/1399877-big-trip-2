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

  addPoint(point) {
    if (point === null || point === undefined) {
      throw new Error('PointModel.addPoint: point must not be null or undefined');
    }

    if (typeof point !== 'object') {
      throw new Error('PointModel.addPoint: point must be an object');
    }

    let nextBasePrice = 0;
    const rawPrice = point.basePrice;

    if (typeof rawPrice === 'number' && Number.isFinite(rawPrice) && rawPrice >= 0) {
      nextBasePrice = rawPrice;
    }

    const normalizedPoint = {
      ...point,
      basePrice: nextBasePrice,
    };

    this.points = [normalizedPoint, ...this.points];

  }

  updatePoint(updatedPoint) {
    if (updatedPoint === null || updatedPoint === undefined) {
      return;
    }

    const id = updatedPoint.id;
    if (id === null || id === undefined) {
      return;
    }

    let nextBasePrice = 0;
    const rawPrice = updatedPoint.basePrice;

    if (typeof rawPrice === 'number' && Number.isFinite(rawPrice) && rawPrice >= 0) {
      nextBasePrice = rawPrice;
    }

    const normalizedPoint = {
      ...updatedPoint,
      basePrice: nextBasePrice,
    };

    this.points = this.points.map((point) =>
      point.id === id ? normalizedPoint : point
    );
  }

  deletePoint(pointId) {
    if (pointId === null || pointId === undefined) {
      throw new Error('PointModel.deletePoint: pointId must not be null or undefined');
    }

    this.points = this.points.filter((point) => point.id !== pointId);
  }
}
