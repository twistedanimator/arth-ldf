const str = `HR	Х1	82.45	78.45	75.96	73.53	72.38	71.93	71.97	72.38
CV	Х2	-68.90	-62.61	-59.79	-57.71	-57.05	-57.08	-58.92	-62.43
SDNN	Х3	7.86	7.29	7.07	6.93	6.93	6.99	7.30	7.66
SI	Х4	0.01	-0.03	-0.05	-0.06	-0.06	-0.06	-0.05	-0.04
Mean	Х5	4.03	3.91	3.83	3.74	3.70	3.70	3.69	3.67
AMo50	Х6	0.46	0.57	0.55	0.46	0.35	0.27	0.17	0.19
Mo	Х7	0.03	0.02	0.02	0.02	0.03	0.04	0.05	0.10
D	Х8	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00
MxDMn	Х9	-0.07	-0.07	-0.07	-0.07	-0.06	-0.06	-0.06	-0.05
pNN50	Х10	-0.54	-0.55	-0.58	-0.63	-0.63	-0.59	-0.52	-0.49
HFmx	Х11	0.10	0.09	0.09	0.09	0.09	0.09	0.09	0.08
RMSSD	Х12	-0.40	-0.37	-0.36	-0.34	-0.34	-0.34	-0.36	-0.35
Xmin	Х13	0.03	0.03	0.03	0.02	0.02	0.02	0.01	-0.01
AMo7.8	Х14	4.92	4.52	4.29	4.17	4.35	4.31	4.50	3.93
Константа		-5178.59	-4738.94	-4468.35	-4221.39	-4116.75	-4089.98	-4111.68	-4178.41`

const arr = str.split('\n').map(str => str.split('\t').map(str => (str.length && !isNaN(parseFloat(str))? parseFloat(str) : str))).map(arr => {arr.splice(1, 1); return arr})
console.log(arr)