# Purdue Milford
#### build 5, 11/3/2025

### Reports:



- Summary(Current assumption of whats needed)
    - Server
    - Station 
    - Cutter# 
    - CutterName 
    - Code 
    - Code Description      *cuts.description*
    - In Pounds
    - GradeA Pounds 
    - GradeA Yield           *GradeA Pounds / In Pounds*
    - SYieldA               *(cuts.PrimaryYieldStandard)*
    - POSYieldA             *Percent Of Standard YieldA   (GradeAYield / cuts.PrimaryYieldStandard)*
    - GradeB Pounds 
    - GradeB Yield           *GradeB Pounds / In Pounds*
    - Total Pounds          *GradeA + GradeB*
    - Overall Yield         *Total Pounds / In Pounds*
    - AQLScore              *Sum(checks.AQLScore) / count(checks)*
    - POSAQL                *Percent Of Standard AQL (Sum(checks.AQLScore) / count(checks) / cuts.AQLScoreStandard)*
    - Hours                 
    - PPMH                  *Total Pounds / Hours*
    - SPPMH                 *cuts.PPHM standard*
    - POSPPMH               *Percent Of Standard PPHM / cuts.PPHM standard*


    
- QA (preliminary assumption)
    - Server
    - Code
    - Description
    - Cutter
    - CutterName
    - Checker
    - CheckerName
    - TotalChecks
    - Passed    
    - PassPercent    
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
    - AqlScore    
    - TotalDefects
    


### API:
- GET  /api/scale/summary?start=1747137600&stop=1747184400/groupby=server,product,cutter    *this endpoint is not defined yet*
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
- POST /api/qc/setCheckEvent    *todo: add aqlscore the json payload*
- POST /api/qalog/addevent
- GET  /api/qc/summary?start=1747137600&stop=1747184400/groupby=server,product,cutter *this endpoint is not defined yet*



      
### Notes:

- This app pulls data from a database depending on the timeframe option selected.
- To start in demo mode append "/demo" to the URI.
- Demo mode trimline only has data for *will add later*
- light and dark mode themes available
- demo login username,password: admin,weightech
