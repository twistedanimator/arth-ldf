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
				'Константа', -1812.6,
				-1380.5,     -1281.1,
				-1231.4,     -1208.7,
				-1200.8,     -1197.9,
				-1244.5
			],
			[
				'Пульс', 40.34,     
				33.6,    31.59,     
				30.36,   29.52,     
				28.85,   28.33,     
				28.29
			],
			[
				'СВ',    -351.39,   
				-282.89, -262.81,   
				-250.04, -241.21,   
				-233.52, -228.87,   
				-229.06
			],
			[
				'УО',  20,    16.29,
				15.21, 14.56, 14.08,
				13.65, 13.5,  13.63 
			],
			[
				'ПСС',  191.33,
				209.97, 220.77,
				228.7,  237.08,
				246.1,  251.29,
				259.78
			],
			[
				'УИ', 2.88, 3.67,
				4.03, 4.19, 4.48,
				4.75, 4.88, 5.14
			],
			[
				'ОСВ', -0.42,
				-0.42, -0.44,
				-0.44, -0.45,
				-0.44, -0.43,
				-0.4
			],
			[
				'АДп', 2.47, 2.26,
				2.26,  2.27, 2.29,
				2.3,   2.26, 2.22
			],
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
