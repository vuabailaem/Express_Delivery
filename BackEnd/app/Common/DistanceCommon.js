const calculateDistance = (pos1, pos2) => {
    const result = Math.pow(pos2.lat - pos1.lat, 2) + Math.pow(pos2.lng - pos1.lng, 2);
    return Math.sqrt(result);
};

const findTheNearest = (pos, arrShippers) => {
  let nearest = arrShippers[0];
  let distanceNearest = calculateDistance(pos, arrShippers[0])
  for(let i = 1; i < arrShippers.length; i++) {
      if(calculateDistance(pos, arrShippers[i]) < distanceNearest) {
          distanceNearest = calculateDistance(pos, arrShippers[i]);
          nearest = arrShippers[i];
      }
  }
  return nearest;
};

module.exports = {
    calculateDistance,
    findTheNearest
};
