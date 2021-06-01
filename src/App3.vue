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
				'Константа', -5178.59,
				-4738.94,    -4468.35,
				-4221.39,    -4116.75,
				-4089.98,    -4111.68,
				-4178.41
			],
			[
				'HR',  82.45,
				78.45, 75.96,
				73.53, 72.38,
				71.93, 71.97,
				72.38
			],
			[
				'CV',   -68.9,
				-62.61, -59.79,
				-57.71, -57.05,
				-57.08, -58.92,
				-62.43
			],
			[
				'SDNN', 7.86,
				7.29,   7.07,
				6.93,   6.93,
				6.99,   7.3,
				7.66
			],
			[
				'SI',  0.01,  -0.03,
				-0.05, -0.06, -0.06,
				-0.06, -0.05, -0.04
			],
			[
				'Mean', 4.03, 3.91,
				3.83,   3.74, 3.7,
				3.7,    3.69, 3.67
			],
			[
				'AMo50', 0.46,
				0.57,    0.55,
				0.46,    0.35,
				0.27,    0.17,
				0.19
			],
			[
				'Mo', 0.03, 0.02,
				0.02, 0.02, 0.03,
				0.04, 0.05, 0.1
			],
			[
				'D', 0, 0, 0, 0,
				0,   0, 0, 0
			],
			[
				'MxDMn', -0.07,
				-0.07,   -0.07,
				-0.07,   -0.06,
				-0.06,   -0.06,
				-0.05
			],
			[
				'pNN50', -0.54,
				-0.55,   -0.58,
				-0.63,   -0.63,
				-0.59,   -0.52,
				-0.49
			],
			[
				'HFmx', 0.1,
				0.09,   0.09,
				0.09,   0.09,
				0.09,   0.09,
				0.08
			],
			[
				'RMSSD', -0.4,
				-0.37,   -0.36,
				-0.34,   -0.34,
				-0.34,   -0.36,
				-0.35
			],
			[
				'Xmin', 0.03,
				0.03,   0.03,
				0.02,   0.02,
				0.02,   0.01,
				-0.01
			],
			[
				'AMo7.8', 4.92,
				4.52,     4.29,
				4.17,     4.35,
				4.31,     4.5,
				3.93
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
