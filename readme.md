# Purdue Milford
#### build 9, 11/16/2025

### Reports:

(Current assumption of whats needed)

- Trim Summary    
    - Station 
    - Cutter# 
    - CutterName 
    - Code 
    - Description      
    - In Pounds
    - Out Pounds 
    - Yield           
    - AQLScore              (*Sum(checks.AQLScore) / count(checks)*)    
    - Hours                 
    - PPMH                  
    - PcPM     (*Piece count Per Minute?*)      


    
- QA Summary    
    - Code
    - Description
    - Cutter
    - CutterName
    - Checker
    - CheckerName
    - TotalChecks    
    - Defects1
    - Defects2
    - Defects3
    - Defects4
    - Defects5
    - Defects6
    - Defects7
    - Defects8
    - Defects9
    - Defects10
    - AvgInspectionTime
    - Weight    
    - AvgPieceWeight
    - AqlScore    
    - TotalDefects
    - SampleCount
     


### API:
- GET  /api/trimline/summary?start=1747137600&stop=1747184400/groupby=server,product,cutter    
- GET  /api/qc/summary?start=1747137600&stop=1747184400/groupby=server,product,cutter 
- POST /api/users/loginuser
- GET  /api/users/loadusers
- POST /api/users/saveusers
- GET  /api/employees/loademployees
- POST /api/employees/saveemployees
- GET  /api/scale/loadstations
- POST /api/scale/savestations
- GET  /api/products/loadcuts
- POST /api/products/savecuts
- GET  /api/qc/getCheckEvent 
- POST /api/qc/setCheckEvent   
- GET  /api/punches/loadpunches?start=1747137600&stop=1747184400
- POST /api/punches/savepunches?start=1747137600&stop=1747184400


## DG Diffs
- added punches table
- cutters table: removed hiredate and category. added updatedBy, updatedAt
- cuts table schema is the same.  qc station only expects AGrade and Downgrade cuts/codes.
- stations table schema is the same.
- users table is the same.
- qc results: added aqlScore,aqlStandard and sampleCount.  sample count is keyed-in by the checker.


### Notes:

- this app pulls data from a database depending on the timeframe option selected.
- to start in demo mode append "/demo" to the URI.
- demo mode trimline only has data for *will add later*
- light and dark mode themes available
- demo login username,password: admin,weightech
- reports and setup(cuts,cutters,punches) are centralize on dbserver.
- qc station operation is all local, including calls to loademployees, loadcuts, getcheckEvent and saveCheckEvent. 
- qc Teguar will need to store a local copy of cuts and employees tables in case the network is down and a call to the dbserver cant be made.
