<template>
  <v-app>
    <v-main>

    	<v-container>
    		<v-row>

      			<v-col>
					<v-card height="100%">
						<v-card-text>
							<v-form ref="form">

								<v-text-field label="Имя" v-model="name" ref="nameInput" dense/>
								<v-text-field label="Фамилия" v-model="surname" dense/>

								<v-text-field label="Дата" v-model="date" type="date" dense/>
								<v-text-field label="Время" v-model="time" type="time" dense/>

								<v-text-field v-for="(c, index) in coefs" :label="c[0]" v-model.number="values[index]" :key="index" type="number" dense/>								

							</v-form>
						</v-card-text>
					</v-card>						
      			</v-col>

				<v-col>
					<v-card height="100%"> 

						<v-card-text>
							<v-list>
								<v-list-item v-for="(label, index) in ldfLabels" :key="index">									
									<v-list-item-content :class="{'red--text': index === ldfMaxIndex}">
										<v-list-item-title v-text="`${label}`"/>
										<v-list-item-subtitle v-text="ldf[index]"/>
									</v-list-item-content>
								</v-list-item>

								<v-btn @click="add" color="primary" width="100%" :style="{margin: '15px 0'}" :disabled="!canAdd">ДОБАВИТЬ</v-btn>
								<v-btn @click="save" color="error" width="100%" tabindex="-1" :disabled="!this.entries.length">СОХРАНИТЬ</v-btn>
							</v-list>
						</v-card-text>

					</v-card>						
      			</v-col>

				<v-col cols="5" lg="6">
					<v-card height="100%">

						<v-simple-table dense>							
							<template v-slot:default>

								<thead>
									<tr>
									<th class="text-left">
										Время
									</th>
									<th class="text-left">
										Имя
									</th>
									<th class="text-left">
										Фамилия
									</th>
									<th class="text-left">
										Уровень
									</th>
									</tr>
								</thead>

								<tbody>
									<tr v-for="(item, index) in entries" :key="index">
										<td>{{ item.date }} {{ item.time }}</td>
										<td>{{ item.name }}</td>
										<td>{{ item.surname }}</td>
										<td>{{ item.value }}</td>
									</tr>
								</tbody>

							</template>
						</v-simple-table>

					</v-card>					
				</v-col>

    		</v-row>

			
    	</v-container>

    </v-main>

	<a ref="invisibleAnchor"/>
  </v-app>
</template>

<script>

export default 
{
  name: 'App',

  data: () => ({

		name: '',
		surname: '',
		date: 0,
		time: 0,

		values: [],

		entries: [],

		isOpenedDatePicker: false,

		ldfLabels: ['критический', 'экстремальный', 'очень плохой', 'неудовлетворительный', 'удовлетворительный', 'хороший', 'очень хороший', 'отличный'],

		coeficients: [
			[
				'Константа', -2110.21,
				-2075.82,    -2093.51,
				-2103.58,    -2131.55,
				-2113.53,    -2148.6,
				-2171.33
			],
			[
				'АльфаИ', 9.43, 
				9.74,     10.16,
				10.48,    10.94,
				11.18,    11.61,
				11.86
			],
			[
				'EEG POLY L',   
				-0.22,
				-0.19,
				-0.17,
				-0.15,
				-0.13,
				-0.1,
				-0.08,
				-0.04
			],
			[ 'Дельта1И', 9.69, 9.05, 8.77, 8.28, 7.91, 7.43, 7.14, 6.76 ],
			[
				'АльфаМ', -0.9,
				-0.95,    -1.01,
				-1.05,    -1.11,
				-1.15,    -1.18,
				-1.13
			],
			[
				'ПользМ', 0.86,
				0.87,     0.91,
				0.92,     0.95,
				0.98,     1,
				1
			],
			[
				'Бета2М', 3.53,
				3.62,     3.62,
				3.75,     3.75,
				3.69,     3.54,
				2.87
			],
			[
				'Бета2И', -5.79,
				-6.02,    -5.94,
				-6.17,    -6.16,
				-5.96,    -5.79,
				-5.1
			],
			[
				'Дельта2И', 13.86,
				13.44,      13.25,
				12.97,      12.81,
				12.28,      12.39,
				12.29
			],
			[
				'ПользИ', 33.83,
				33.67,    33.77,
				33.87,    33.95,
				33.66,    33.63,
				33.35
			],
			[
				'Бета1И', 12.28,
				12.31,    12.51,
				12.45,    12.62,
				12.46,    12.52,
				12.47
			],
			[
				'Дельта1М', -1.08,
				-1.08,      -1.12,
				-1.13,      -1.17,
				-1.19,      -1.22,
				-1.22
			]
]

  }),

  mounted()
  {
	  this.values = Array(this.coeficients.length - 1)
	  this.reset()
  },

  computed:
  {
	  coefs()
	  {
		  const [constant, ...coefs] = this.coeficients
		  return coefs
	  },

	  ldf()
	  {
		return this.ldfLabels.map( (_, i) =>
		{
			return this.coeficients
				.map((coef, index) => coef[i+1] * (index? this.values[index - 1] : 1))
				.reduce((sum, value) => sum + value, 0)
		})
	  },

	  ldfMaxIndex()
	  {
		  return this.ldf.indexOf(Math.max(...this.ldf))
	  },
	  canAdd()
	  {
		  return this.name && this.surname
	  }
	  
  },

  methods:
  {
	  save()
	  {
		let a = this.$refs.invisibleAnchor
		let text = this.entries.reduce( (acc, item) => `${acc}${item.date}\t${item.time}\t${item.name}\t${item.surname}\t${item.value}\n`, '' )
		let file = new Blob([text], {type: 'text/csv'});
		a.href = URL.createObjectURL(file);
		a.download = 'data.csv';
		a.click()
	  },

	  add()
	  {
		  this.entries.push({
			  name: this.name,
			  surname: this.surname,
			  value: this.ldfLabels[this.ldfMaxIndex],
			  date: this.date,
			  time: this.time
		  })

		  this.reset()
	  },

	  reset()
	  {
		  this.name = this.surname = ''		  

		  this.values.fill(0)

		  const date = new Date()
		  this.date = date.toISOString().substr(0, 10)
		  this.time = date.toISOString().substr(11, 5)

		  this.isOpenedDatePicker = false
		  this.$nextTick( () => this.$refs.nameInput.focus() )
	  }
  }
};
</script>
