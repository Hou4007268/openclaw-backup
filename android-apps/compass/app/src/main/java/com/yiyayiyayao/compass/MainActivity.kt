package com.yiyayiyayao.compass

import android.hardware.Sensor
import android.hardware.SensorEvent
import android.hardware.SensorEventListener
import android.hardware.SensorManager
import android.os.Bundle
import android.view.animation.Animation
import android.view.animation.RotateAnimation
import androidx.appcompat.app.AppCompatActivity
import com.yiyayiyayao.compass.databinding.ActivityMainBinding

class MainActivity : AppCompatActivity(), SensorEventListener {

    private lateinit var binding: ActivityMainBinding
    private lateinit var sensorManager: SensorManager
    
    private var accelerometer: Sensor? = null
    private var magnetometer: Sensor? = null
    
    private var gravity: FloatArray? = null
    private var geomagnetic: FloatArray? = null
    
    private var currentDegree = 0f

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)

        // 初始化传感器
        sensorManager = getSystemService(SENSOR_SERVICE) as SensorManager
        accelerometer = sensorManager.getDefaultSensor(Sensor.TYPE_ACCELEROMETER)
        magnetometer = sensorManager.getDefaultSensor(Sensor.TYPE_MAGNETIC_FIELD)
        
        // 显示罗盘图片
        binding.imageCompass.setImageResource(R.drawable.compass)
    }

    override fun onResume() {
        super.onResume()
        accelerometer?.let {
            sensorManager.registerListener(this, it, SensorManager.SENSOR_DELAY_UI)
        }
        magnetometer?.let {
            sensorManager.registerListener(this, it, SensorManager.SENSOR_DELAY_UI)
        }
    }

    override fun onPause() {
        super.onPause()
        sensorManager.unregisterListener(this)
    }

    override fun onSensorChanged(event: SensorEvent) {
        when (event.sensor.type) {
            Sensor.TYPE_ACCELEROMETER -> gravity = event.values.clone()
            Sensor.TYPE_MAGNETIC_FIELD -> geomagnetic = event.values.clone()
        }

        if (gravity != null && geomagnetic != null) {
            val r = FloatArray(9)
            val i = FloatArray(9)
            
            if (SensorManager.getRotationMatrix(r, i, gravity, geomagnetic)) {
                val orientation = FloatArray(3)
                SensorManager.getOrientation(r, orientation)
                
                // 计算方向（弧度→角度）
                var degree = Math.toDegrees(orientation[0].toDouble()).toFloat()
                degree = (degree + 360) % 360
                
                // 旋转罗盘（反向，因为图片北方固定）
                animateRotation(-degree + currentDegree)
                currentDegree = degree
                
                // 更新方向文字
                updateDirectionText(degree)
            }
        }
    }

    private fun animateRotation(fromDegree: Float) {
        val rotate = RotateAnimation(
            fromDegree, 0f,
            Animation.RELATIVE_TO_SELF, 0.5f,
            Animation.RELATIVE_TO_SELF, 0.5f
        )
        rotate.duration = 200
        rotate.fillAfter = true
        binding.imageCompass.startAnimation(rotate)
    }

    private fun updateDirectionText(degree: Float) {
        val directions = arrayOf("北", "东北", "东", "东南", "南", "西南", "西", "西北")
        val index = ((degree + 22.5f) / 45f).toInt() % 8
        
        binding.tvDegree.text = "${degree.toInt()}°"
        binding.tvDirection.text = directions[index]
        
        // 指针颜色（可选：根据方向变色）
        val color = when(index) {
            0,4 -> 0xFFFF0000.toInt() // 南北红
            else -> 0xFF000000.toInt()
        }
        binding.tvDirection.setTextColor(color)
    }

    override fun onAccuracyChanged(sensor: Sensor?, accuracy: Int) {
        // 可选：处理精度变化
    }
}
