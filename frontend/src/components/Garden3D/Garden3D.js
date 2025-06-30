import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import { useSelector, useDispatch } from 'react-redux';
import { 
  setSelectedPlant, 
  setGardenMode, 
  fetchGardenState,
  plantFlower,
  waterPlant 
} from '../../store/gardenSlice';

// 地面组件
const Ground = () => {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]}>
      <planeGeometry args={[20, 20]} />
      <meshStandardMaterial color="#8B4513" />
    </mesh>
  );
};

// 草地组件
const Grass = () => {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.99, 0]}>
      <planeGeometry args={[18, 18]} />
      <meshStandardMaterial color="#90EE90" />
    </mesh>
  );
};

// 单个植物组件
const Plant = ({ plant, onClick }) => {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  const getPlantColor = (growth) => {
    if (growth < 30) return '#90EE90'; // 浅绿色 - 幼苗
    if (growth < 70) return '#228B22'; // 深绿色 - 成长中
    return '#FF69B4'; // 粉色 - 开花
  };

  const getPlantSize = (growth) => {
    const baseSize = 0.5;
    return baseSize + (growth / 100) * 1.5;
  };

  return (
    <group position={[plant.position.x, 0, plant.position.z]}>
      {/* 植物茎干 */}
      <mesh
        ref={meshRef}
        position={[0, getPlantSize(plant.growth) / 2, 0]}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={onClick}
        scale={hovered ? 1.1 : 1}
      >
        <cylinderGeometry args={[0.1, 0.1, getPlantSize(plant.growth)]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>
      
      {/* 植物叶子/花朵 */}
      <mesh position={[0, getPlantSize(plant.growth), 0]}>
        <sphereGeometry args={[0.3 + (plant.growth / 100) * 0.3]} />
        <meshStandardMaterial color={getPlantColor(plant.growth)} />
      </mesh>

      {/* 植物信息标签 */}
      {hovered && (
        <Text
          position={[0, getPlantSize(plant.growth) + 1, 0]}
          fontSize={0.2}
          color="black"
          anchorX="center"
          anchorY="middle"
        >
          {`${plant.type}\n成长度: ${plant.growth}%`}
        </Text>
      )}
    </group>
  );
};

// 种植位置标记组件
const PlantingSpot = ({ position, onClick }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <mesh
      position={[position.x, -0.8, position.z]}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onClick={onClick}
    >
      <cylinderGeometry args={[0.5, 0.5, 0.1]} />
      <meshStandardMaterial 
        color={hovered ? "#DEB887" : "#D2B48C"} 
        transparent 
        opacity={0.7} 
      />
    </mesh>
  );
};

// 主场景组件
const GardenScene = () => {
  const dispatch = useDispatch();
  const { gardenState, gardenMode, selectedPlant } = useSelector(state => state.garden);
  
  // 本地状态用于模拟种植和浇水效果
  const [localPlants, setLocalPlants] = useState([]);
  
  // 使用Redux中的植物数据，如果为空则使用本地状态
  const plants = gardenState.plants.length > 0 ? gardenState.plants : localPlants;
  
  // 预定义的种植位置网格
  const plantingPositions = [];
  for (let x = -6; x <= 6; x += 3) {
    for (let z = -6; z <= 6; z += 3) {
      plantingPositions.push({ x, z });
    }
  }

  // 获取空闲的种植位置
  const getAvailablePositions = () => {
    return plantingPositions.filter(pos => 
      !gardenState.plants.some(plant => 
        Math.abs(plant.position.x - pos.x) < 1 && 
        Math.abs(plant.position.z - pos.z) < 1
      )
    );
  };

  const handlePlantClick = (plant) => {
    dispatch(setSelectedPlant(plant));
    
    if (gardenMode === 'water') {
      dispatch(waterPlant(plant.id));
    }
  };

  const handleSpotClick = (position) => {
    if (gardenMode === 'plant') {
      const plantData = {
        type: 'flower',
        position: position,
        seedType: 'basic'
      };
      dispatch(plantFlower(plantData));
    }
  };

  return (
    <>
      {/* 环境照明 */}
      <ambientLight intensity={0.6} />
      <directionalLight 
        position={[10, 10, 5]} 
        intensity={1}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />

      {/* 地面和草地 */}
      <Ground />
      <Grass />

      {/* 现有植物 */}
      {gardenState.plants.map((plant) => (
        <Plant
          key={plant.id}
          plant={plant}
          onClick={() => handlePlantClick(plant)}
        />
      ))}

      {/* 种植位置标记（仅在种植模式下显示） */}
      {gardenMode === 'plant' && 
        getAvailablePositions().map((position, index) => (
          <PlantingSpot
            key={index}
            position={position}
            onClick={() => handleSpotClick(position)}
          />
        ))
      }

      {/* 相机控制 */}
      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        maxPolarAngle={Math.PI / 2}
        minDistance={5}
        maxDistance={20}
      />
    </>
  );
};

// 主组件
const Garden3D = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    // 初始化时获取花园状态
    dispatch(fetchGardenState());
  }, [dispatch]);

  return (
    <Canvas
      camera={{ position: [10, 8, 10], fov: 60 }}
      shadows
      style={{ 
        height: '600px', 
        background: 'linear-gradient(to bottom, #87CEEB, #E0F6FF)' 
      }}
    >
      <GardenScene />
    </Canvas>
  );
};

export default Garden3D;
