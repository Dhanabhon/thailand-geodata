# Database of Thailand Geodata with Province, District, Sub-district, Postal code, and Geo
An open dataset of Thailand's administrative divisions and postal codes is freely available for research, analysis, and application development.

## ภาพรวม
Thailand Geodata เป็นชุดข้อมูลเปิดที่รวบรวมข้อมูลภูมิศาสตร์ของประเทศไทยอย่างครบถ้วน ครอบคลุมข้อมูลระดับจังหวัด อำเภอ ตำบล และรหัสไปรษณีย์ ชุดข้อมูลนี้ออกแบบมาเพื่อให้ผู้ใช้งานเข้าถึงและนำไปใช้ได้ง่าย โดยมีให้เลือกทั้งในรูปแบบ CSV, JSON และ SQL เพื่อให้สะดวกต่อการนำไปใช้กับโครงการต่าง ๆ เช่น การวิจัย การพัฒนาแอปพลิเคชัน การวิเคราะห์ภูมิศาสตร์ และการให้บริการข้อมูลต่อสาธารณะ

**ข้อมูลในชุดนี้ประกอบด้วย:**

- จังหวัด: ชื่อและรหัสของทุกจังหวัดในประเทศไทย
- อำเภอและตำบล: ชื่อและรหัสของอำเภอและตำบล ทำให้สามารถใช้งานในโครงสร้างลำดับชั้นได้สะดวก
- รหัสไปรษณีย์: รหัสไปรษณีย์มาตรฐานสำหรับแต่ละตำบล

**รูปแบบข้อมูล:**

- CSV: เหมาะสำหรับการใช้งานในโปรแกรมสเปรดชีตและการวิเคราะห์ข้อมูล
- JSON: เหมาะสำหรับการใช้งานในแอปพลิเคชันเว็บและ API
- SQL: พร้อมนำเข้าในฐานข้อมูลโดยตรงสำหรับการใช้งานในระบบต่าง ๆ

Thailand Geodata ช่วยให้นักพัฒนา นักวิจัย และผู้สนใจทั่วไป สามารถนำข้อมูลไปใช้ประโยชน์ได้ในหลายมิติ ทั้งการพัฒนาแอปพลิเคชัน การทำแผนที่ภูมิภาค และการวิเคราะห์เชิงพื้นที่ของประเทศไทย

## ตัวอย่างการใช้งานและ Live Demo

### **Web App**
**Demo:** [GitHub Pages Demo](https://dhanabhon.github.io/thailand-geodata/examples/web-app/)

- สถิติแบบเรียลไทม์และการค้นหา
- เครื่องมือสำรวจจังหวัดแบบโต้ตอบ
- รองรับอุปกรณ์มือถือ
- ใช้งานผ่าน GitHub Pages โดยไม่ต้องติดตั้งอะไร

### **ตัวอย่างโค้ดแต่ละภาษา**
ตัวอย่างการใช้งานใน [examples/](./examples/):
- **Python** - วิเคราะห์ข้อมูลด้วย pandas
- **JavaScript/Node.js** - สำหรับเว็บแอป และ API
- **Java** - พร้อม Maven และ JSON processing
- **Go** - ประสิทธิภาพสูงด้วย built-in JSON
- **PHP** - สำหรับเว็บไซต์และ CSV export
- **C#** - .NET 6 พร้อม async/await

## จำนวนจังหวัด อำเภอ และตำบลทั้งหมด
- 77 จังหวัด
- 928 อำเภอ
- 7,436 ตำบล

## โครงสร้างไฟล์และฟิลด์ข้อมูล
ชุดข้อมูลใน Thailand Geodata ประกอบด้วยไฟล์ข้อมูลในหลายรูปแบบ ได้แก่ CSV, JSON และ SQL ซึ่งแต่ละไฟล์มีโครงสร้างที่ประกอบด้วยฟิลด์ต่าง ๆ ดังนี้:

**1. ไฟล​์ CSV**
   - ฟิลด์หลัก:
     - `PROVINCE_ID`: ไอดีแต่ละจังหวัด
     - `CODE`: รหัสจังหวัด
     - `PROVINCE_THAI` และ `PROVINCE_ENGLISH`: ชื่อจังหวัดทั้งภาษาไทยและภาษาอังกฤษ
     - `UPDATED_AT`: Timestamp เมื่อข้อมูลถูกอัปเดตล่าสุด
     - `CREATED_AT`: Timestamp เมื่อข้อมูลถูกสร้าง
  
**2. ไฟล์ JSON**
  - โครงสร้างข้อมูลในไฟล์ JSON จะเป็นแบบ hierarchical ทำให้ง่ายต่อการดึงข้อมูลในแต่ละระดับ:

```json
{
    "PROVINCE_ID": "Province unique ID",
    "CODE": "Province unique code",
    "PROVINCE_THAI": "Province name in Thai",
    "PROVINCE_ENGLISH": "Province name in English",
    "UPDATED_AT": "timestamp ข้อมูลอัปเดตล่าสุด",
    "CREATED_AT": "timestamp ข้อมูลที่สร้าง"
}
```

**3. ไฟล์ SQL**

- ไฟล์นี้ประกอบด้วยคำสั่ง SQL สำหรับการสร้างและใส่ข้อมูลลงในฐานข้อมูล:
  
  - โครงสร้างตาราง:
    - `Provinces`: สำหรับเก็บข้อมูลจังหวัด
    - `Districts`: สำหรับเก็บข้อมูลอำเภอ/เขต
    - `Sub_Districts`: สำหรับเก็บข้อมูลตำบล/แขวง พร้อมด้วยรหัสไปรษณีย์

  - ฟิลด์สำคัญ:
    - `PROVINCE_ID`, `CODE`, `PROVINCE_THAI`, `PROVINCE_ENGLISH`, `UPDATED_AT`, `CREATED_AT`
    - `DISTRICT_ID`, `PROVINCE_ID`, `CODE`, `DISTRICT_CODE`, `DISTRICT_THAI`, `PROVINCE_ENGLISH`, `UPDATED_AT`, `CREATED_AT`
    - `SUB_DISTRICT_ID`, `DISTRICT_ID`, `CODE`, `SUB_DISTRICT_CODE`, `SUB_DISTRICT_THAI`, `SUB_DISTRICT_ENGLISH`, `LATITUDE`, `LONGITUDE`, `POSTAL_CODE`, `UPDATED_AT`, `CREATED_AT`
   
ข้อมูลเหล่านี้จะช่วยให้ผู้ใช้สามารถทำความเข้าใจโครงสร้างและรายละเอียดของข้อมูลในแต่ละฟอร์แมตได้อย่างง่ายดาย รวมถึงเลือกใช้งานรูปแบบที่เหมาะสมกับความต้องการของโปรเจกต์แต่ละประเภท

## ER Diagram
![ER Diagram](/er-diagram/er-diagram.png)

## แนวทางการร่วมพัฒนา (Contribution Guidelines)

สามารถเข้ามา contribute ได้:

1. **Report Issues**: หากพบข้อผิดพลาดหรือมีข้อเสนอแนะ โปรดเปิด Issue พร้อมรายละเอียด
2. **Make Changes**: Fork repo, สร้าง branch ใหม่, ทำการอัปเดต และเปิด Pull Request (PR) มายัง branch หลัก โดยยึดตามรูปแบบข้อมูลที่มีอยู่ ณ ปัจจุบัน

> [!WARNING]
> ข้อมูลตำบลจากแต่ละแหล่งข้อมูลอาจมีจำนวนไม่เท่ากัน กรุณาตรวจสอบความถูกต้องข้อมูลก่อน หากมีข้อมูลเพิ่มเติมสามารถแจ้งได้ หรือ `fork` ไปแก้ไขได้เลย
