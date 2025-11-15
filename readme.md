# Purdue Milford
#### build 7, 11/15/2025

### Reports:



- Summary(Current assumption of whats needed)
    
    - Station 
    - Cutter# 
    - CutterName 
    - Code 
    - Description      *cuts.description*
    - In Pounds
    - Out Pounds 
    - Yield           *GradeA Pounds / In Pounds*
    - Standard Yield               *(cuts.PrimaryYieldStandard)*
    - POSYield             *Percent Of Standard YieldA   (GradeAYield / cuts.PrimaryYieldStandard)*    
    - AQLScore              *Sum(checks.AQLScore) / count(checks)*
    - AQL standard          cuts.aql
    - POSAQL                *Percent Of Standard AQL (Sum(checks.AQLScore) / count(checks) / cuts.AQLScoreStandard)*
    - Hours                 
    - PPMH                  *Total Pounds / Hours*
    - SPPMH                 *cuts.PPHM standard*
    - POSPPMH               *Percent Of Standard PPHM / cuts.PPHM standard*


    
- QA (preliminary assumption)    
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
    - AQL standard          cuts.aql 
    - POSAQL                *Percent Of Standard AQL (Sum(checks.AQLScore) / count(checks) / cuts.AQLScoreStandard)*
    - TotalDefects
    


### API:
- GET  /api/trimline/summary?start=1747137600&stop=1747184400/groupby=server,product,cutter    *this endpoint is not defined yet*
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
- GET  /api/punches/load/{productionDate}/{shift}
- POST /api/punches/save/{productionDate}/{shift}

- GET  /api/qc/summary?start=1747137600&stop=1747184400/groupby=server,product,cutter *this endpoint is not defined yet*



      
### Notes:

- This app pulls data from a database depending on the timeframe option selected.
- To start in demo mode append "/demo" to the URI.
- Demo mode trimline only has data for *will add later*
- light and dark mode themes available
- demo login username,password: admin,weightech
